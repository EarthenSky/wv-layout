# antlr setup
- see https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md

## setup
```sh
pip install antlr4-tools
git clone https://github.com/antlr/grammars-v4
cd grammars-v4/python/python3/JavaScript
antlr4 -Dlanguage=JavaScript grammars-v4/python/python3/Python3Lexer.g4
antlr4 -Dlanguage=JavaScript grammars-v4/python/python3/Python3Parser.g4
# copy files to parser .js .interp .tokens (including ParserBase & LexerBase)
# replace all instances of ".self" with ".this" -> so the parser runs in nodejs -> NOTE: transform grammars.py should fix it? make sure to double check this
# in the past I needed to do the following:
# npm install --save antlr4 
# npm install --save-dev webpack webpack-cli 
# npm install --save-dev babel-register # this enables ES6 
#npx webpack --config webpack.config.js
npm update 
npm run build 
npm start
```