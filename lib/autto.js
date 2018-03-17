const AuttoLexer = require('./lexer');
const AuttoParser = require('./parser');
const AuttoVisitor = require('./visitor');

const lexer = new AuttoLexer();
const parser = new AuttoParser();
const visitor = new (AuttoVisitor(parser))();

module.exports = {
    lexer: lexer,
    parser: parser,
    visitor: visitor,

    execute: function(input, context) {
        const lexingResult = lexer.tokenize(input);
        const rule = parser._defaultRule;

        parser.reset();
        parser.input = lexingResult.tokens;
        
        const parseResult = {
            cst: parser[rule](),
            errors: parser.errors
        }

        visitor._context = context || {};
        const result = visitor.visit(parseResult.cst);

        return {
            result: result,
            lexing: lexingResult,
            parsing: parseResult
        }
    }
};