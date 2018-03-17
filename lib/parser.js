const chevrotain = require('chevrotain');

const Tokens = require('./tokens');

const Parser = chevrotain.Parser;
class AuttoParser extends Parser {
    constructor() {
        super('', Tokens.all, {
            recoveryEnabled: true,
            // This will automatically create a Concrete Syntax Tree
            // You can inspect this structure in the output window.
            outputCst: true
        })

        const $ = this;

        // ENTRY RULE
        $._defaultRule = 'AUTTO';
        $.RULE('AUTTO', () => {
            $.OR([
                { ALT: () => { $.SUBRULE($.expression) } },
                { ALT: () => {
                    $.AT_LEAST_ONE(() => {
                        $.SUBRULE($.conditionExpression);
                    });
                }}
            ]);
        });

        $.RULE('expression', () => {
            $.SUBRULE($.orExpression);
        });

        $.RULE('conditionExpression', () => {
            $.CONSUME(Tokens.If);
            $.SUBRULE($.expression);

            $.OR([
                { ALT: () => { $.SUBRULE($.gotoExpression) } },
                { ALT: () => { $.SUBRULE($.thenExpression) } }
            ]);

            $.OPTION(() => {
                $.SUBRULE($.elseExpression);
            });
        });

        $.RULE('gotoExpression', () => {
            $.CONSUME(Tokens.Goto);
            $.CONSUME(Tokens.ActionId);
        });

        $.RULE('thenExpression', () => {
            $.CONSUME(Tokens.Then);
            $.SUBRULE($.expression);
        });

        $.RULE('elseExpression', () => {
            $.CONSUME(Tokens.Else);

            $.OR([
                { ALT: () => { $.SUBRULE($.gotoExpression) } },
                { ALT: () => { $.SUBRULE($.expression) } }
            ]);
        });

        $.RULE('comparisonExpression', () => {
            $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
            $.MANY(() => {
                $.CONSUME(Tokens.ComparisonOperator);
                $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
            });
        });

        $.RULE('andExpression', () => {
            $.SUBRULE($.comparisonExpression, { LABEL: 'lhs' });
            $.MANY(() => {
                $.CONSUME(Tokens.And);
                $.SUBRULE2($.comparisonExpression, { LABEL: 'rhs' });
            });
        });

        $.RULE('orExpression', () => {
            $.SUBRULE($.andExpression, { LABEL: 'lhs' });
            $.MANY(() => {
                $.CONSUME(Tokens.Or);
                $.SUBRULE2($.andExpression, { LABEL: 'rhs' });
            });
        });

        $.RULE('atomicExpression', () => {
            $.OR([
                { ALT: () => { $.SUBRULE($.parenthesisExpression) } },
                { ALT: () => { $.SUBRULE($.Literal) } },
                { ALT: () => { $.CONSUME(Tokens.Identifier) } }
            ]);
        });

        $.RULE('parenthesisExpression', () => {
            $.CONSUME(Tokens.LParen);
            $.SUBRULE($.expression);
            $.CONSUME(Tokens.RParen);
        });


        $.RULE("Literal", () => {
            $.OR([
                { ALT: () => { $.CONSUME(Tokens.StringLiteral) } },
                { ALT: () => { $.CONSUME(Tokens.NumberLiteral) } },
                { ALT: () => { $.CONSUME(Tokens.True) } },
                { ALT: () => { $.CONSUME(Tokens.False) } },
                { ALT: () => { $.CONSUME(Tokens.Null) } }
            ]);
        });

        // very important to call this after all the rules have been setup.
        // otherwise the parser may not work correctly as it will lack information
        // derived from the self analysis.
        Parser.performSelfAnalysis(this);
    }
}

module.exports = AuttoParser;