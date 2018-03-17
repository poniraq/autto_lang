const _ = require('lodash');
const chevrotain = require('chevrotain');

const createToken = chevrotain.createToken;
const Lexer = chevrotain.Lexer;

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_]+/ });
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });

const True = createToken({ name: "True", pattern: /true/ });
const False = createToken({ name: "False", pattern: /false/ });
const Null = createToken({ name: "Null", pattern: /null/ });

const Goto = createToken({ name: 'Goto', pattern: /GOTO/, longer_alt: Identifier });
const ActionId = createToken({ name: 'ActionId', pattern: /\{[a-zA-Z0-9]+\}/, longer_alt: Identifier });

// TOKENS - COMPARISON

const ComparisonOperator = createToken({
    name: "ComparisonOperator",
    pattern: Lexer.NA
});

const Is = createToken({ name: 'Is', pattern: /IS/, longer_alt: Identifier, categories: ComparisonOperator });
const Not = createToken({ name: 'IsNot', pattern: /NOT/, longer_alt: Identifier, categories: ComparisonOperator });
const IsNot = createToken({ name: 'IsNot', pattern: /IS NOT/, longer_alt: Identifier, categories: ComparisonOperator });
const MoreThan = createToken({ name: 'MoreThan', pattern: /MORE THAN/, longer_alt: Identifier, categories: ComparisonOperator });
const LessThan = createToken({ name: 'LessThan', pattern: /LESS THAN/, longer_alt: Identifier, categories: ComparisonOperator });
const EqualTo = createToken({ name: 'EqualTo', pattern: /EQUAL TO/, longer_alt: Identifier, categories: ComparisonOperator });

const And = createToken({ name: 'And', pattern: /AND/, longer_alt: Identifier });
const Or = createToken({ name: 'Or', pattern: /OR/, longer_alt: Identifier });

// TOKENS - CONDITION

const If = createToken({ name: 'If', pattern: /IF/, longer_alt: Identifier });
const Then = createToken({ name: 'Then', pattern: /THEN/, longer_alt: Identifier });
const Else = createToken({ name: 'Else', pattern: /ELSE/, longer_alt: Identifier });

// TOKENS - LITERALS

const StringLiteral = createToken({
    name: "StringLiteral", pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});
const NumberLiteral = createToken({
    name: "NumberLiteral", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
    line_breaks: true
});


const allTokens = [WhiteSpace, LParen, RParen, ActionId, NumberLiteral, StringLiteral,
    True, False, Null, MoreThan, LessThan, And, Or, EqualTo,
    IsNot, Not, Is, If, Then, Else, Goto, Identifier, ComparisonOperator];


module.exports = {
    all: allTokens
};
_.forEach(allTokens, function (token) {
    module.exports[token.name] = token;
});

