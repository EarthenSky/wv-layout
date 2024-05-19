# Antlr4 Setup
- see https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md

## Setup
You need to do the following to generate the python3 lexer & parser files which will be used to parse input files. Hopefully I'll make a script to do this soon enough, but for now, it's manual :)
```sh
pip install antlr4-tools
git clone https://github.com/antlr/grammars-v4
cd grammars-v4/python/python3/JavaScript
antlr4 -Dlanguage=JavaScript grammars-v4/python/python3/Python3Lexer.g4
antlr4 -Dlanguage=JavaScript grammars-v4/python/python3/Python3Parser.g4
# copy files to the `./parser/` directory. All of `.js`, `.interp`, and `.tokens` (including ParserBase & LexerBase)
# replace all instances of ".self" with ".this" -> so the parser runs in nodejs -> NOTE: transform grammars.py should fix it? make sure to double check this
npm update
npm run build 
npm start
```