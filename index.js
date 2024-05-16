import antlr4 from 'antlr4';
import Lexer from './parser/Python3Lexer.js';
import Parser from './parser/Python3Parser.js';
import Listener from './parser/Python3ParserListener.js';

// TODO: download code from a repo online
export const samplePython3Code = `
import time, os, sys
import threading

import numpy as np
import matplotlib.pyplot as plt

from urllib import request
from shutil import stat, copystat

items = []
for i in range(100):
    print(i)
    items += [i]

def my_name(name: str) -> str:
    return f"my name is {name}"

time.sleep(10)
print("done!")
`;

// ---------------------------------------- //
// Listeners:

function findAllChildTokens(ctx, token) {
    if (ctx.children === null) {
        return [];
    } else {
        let tokens = [];
        for (let j = 0; j < ctx.children.length; j++) {
            let child = ctx.children[j];
            if (child instanceof antlr4.tree.TerminalNode) {
                if (child.symbol.type === token) {
                    tokens.push(child);
                }
            } else if (child instanceof antlr4.ParserRuleContext) {
                tokens = tokens.concat(findAllChildTokens(child, token));
            } else {
                console.log("UH OH LOOK INTO THIS...") // TODO: alert ("this is a bug, please send a pr for this :pray:")
            }
        }
        return tokens;
    }
}

// returns true if any descendent of ctx has token
function childTokenExists(ctx, token) {
    if (ctx.children === null) {
        return false;
    } else {
        for (let j = 0; j < ctx.children.length; j++) {
            let child = ctx.children[j];
            if (child instanceof antlr4.tree.TerminalNode) {
                if (child.symbol.type === token) {
                    return true;
                }
            } else if ((child instanceof antlr4.ParserRuleContext) && childTokenExists(child, token)) {
                return true;
            }
        }
        return false;
    }
}

// ctx must be a antlr4.ParserRuleContext
// earlyStop refers to if it will return the deepest level of expr, or the shallowest (early stop)
// TODO: implement non-early stopping
function collectAllChildRules(ctx, rule/*, earlyStop=true*/) {
    if (ctx.ruleIndex == rule) {
        return ctx;
    } else if (ctx.children === null) {
        return null;
    } else {
        let rules = [];
        for (let j = 0; j < ctx.children.length; j++) {
            let child = ctx.children[j];
            if (child instanceof antlr4.tree.TerminalNode) {
                continue;
            } else if (child instanceof antlr4.ParserRuleContext) {
                if (child.ruleIndex == rule) {
                    rules.push(child);
                } else {
                    rules = rules.concat(collectAllChildRules(child, rule));
                }
            }
        }
        return rules;
    }
}

class ImportListener extends Listener {
    constructor() {
        super();

        this.importModuleList = [];
    }

    enterFile_input(ctx) {
        // reset the list each time a walk is started
        this.importModuleList = [];
        //console.log(findAllChildTokens(ctx, Parser.NEWLINE).length)
    }

    // TODOs:
    // - handle relative imports
    // - warning on modifications to the import path (sys.path & stuff?) -> ask for manual notation + some form of checking?
    // - handle from imports
    // - make sure the entire grammar is taken care of! (according to my brain)
	enterImport_stmt(ctx) {
        if (ctx.import_from() == null) {
            // all instance of Dotted_as_nameContext
            let dottedNames = collectAllChildRules(ctx.import_name(), Parser.RULE_dotted_as_name);
            dottedNames = dottedNames.map(dottedName => {
                /*if (dottedName.AS() !== null) {
                    console.log(dottedName.dotted_name().getText() + " (as " + dottedName.name().getText() + ")");
                } else {
                    console.log(dottedName.dotted_name().getText());
                }*/
                return dottedName.dotted_name().getText();
            });
            this.importModuleList = this.importModuleList.concat(dottedNames);
        } else {
            console.log("TODO: handle from imports")
        }
    }
}

// ---------------------------------------- //
// do parsing

const importListener = new ImportListener();

// TODO: do optimization to find last reference of import, go to next few lines, then cut off file -> multiline import? -> or even, start there & parse until passing the last import
export function getImportsFromCode(codeText) {
    let chars = new antlr4.InputStream(codeText);
    let lexer = new Lexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new Parser(tokens);
    let tree = parser.file_input();

    antlr4.tree.ParseTreeWalker.DEFAULT.walk(importListener, tree);
    return importListener.importModuleList;
}

// getImportsFromCode(samplePython3Code);
// console.log("done parsing!");
