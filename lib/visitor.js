function visitorGenerator (parser) {
    const BaseVisitor = parser.getBaseCstVisitorConstructor();
    class AuttoVisitor extends BaseVisitor {
        constructor(context) {
            super()
            this._context = context;
            // The "validateVisitor" method is a helper utility which performs static analysis
            // to detect missing or redundant visitor methods
            this.validateVisitor()
        }

        comparisonExpression(ctx) {
            const self = this;
            let result = this.visit(ctx.lhs[0]);

            if (ctx.ComparisonOperator) {
                ctx.ComparisonOperator.forEach(function (operator, index) {
                    var rhs = self.visit(ctx.rhs[index]);

                    switch (operator.image) {
                        case 'IS':
                            result = result === rhs;
                            break;
                        case 'NOT':
                            result = result != rhs;
                            break;
                        case 'IS NOT':
                            result = result !== rhs;
                            break;
                        case 'MORE THAN':
                            result = result > rhs;
                            break;
                        case 'LESS THAN':
                            result = result < rhs;
                            break;
                        case 'EQUAL TO':
                            result = result == rhs;
                            break;
                    }
                });
            }

            return result;
        }

        orExpression(ctx) {
            const self = this;
            let result = this.visit(ctx.lhs[0]);
            let i, rhs, len;

            if (ctx.Or && !result) {
                len = ctx.Or.length;

                for (i = 0; i < len; i++) {
                    rhs = self.visit(ctx.rhs[i]);

                    result = result || rhs;

                    if (result) {
                        break;
                    }
                }
            }

            return result;
        }

        andExpression(ctx) {
            const self = this;
            let result = this.visit(ctx.lhs[0]);
            let i, rhs, len;

            if (ctx.And && result) {
                len = ctx.And.length;
                
                for (i = 0; i < len; i++) {
                    rhs = self.visit(ctx.rhs[i]);

                    result = result && rhs;

                    if (!result) {
                        break;
                    }
                }
            }

            return result;
        }

        parenthesisExpression(ctx) {
            return this.visit(ctx.expression[0]);
        }

        expression(ctx) {
            return this.visit(ctx.orExpression[0]);
        }

        AUTTO(ctx) {
            if (ctx.conditionExpression) {
                return this.visit(ctx.conditionExpression[0]);
            } else {
                return this.visit(ctx.expression[0]);
            }
        }

        conditionExpression(ctx) {
            const self = this;
            const conditionResult = self.visit(ctx.expression[0]);

            if (conditionResult) {
                if (ctx.gotoExpression) {
                    return self.visit(ctx.gotoExpression[0]);
                }

                if (ctx.thenExpression) {
                    return self.visit(ctx.thenExpression[0]);
                }
            } else {
                if (ctx.elseExpression) {
                    return self.visit(ctx.elseExpression[0]);
                }
            }

            return conditionResult;
        }

        gotoExpression(ctx) {
            return {
                type: 'GOTO',
                id: ctx.ActionId[0].image.slice(1, -1)
            };
        }

        thenExpression(ctx) {
            return this.visit(ctx.expression[0]);
        }

        elseExpression(ctx) {
            if (ctx.gotoExpression) {
                return this.visit(ctx.gotoExpression[0]);
            }

            return this.visit(ctx.expression[0]);
        }

        atomicExpression(ctx) {
            if (ctx.parenthesisExpression) {
                return this.visit(ctx.parenthesisExpression[0]);
            }

            if (ctx.Literal) {
                return this.visit(ctx.Literal[0]);
            }

            if (ctx.Identifier) {
                let name = ctx.Identifier[0].image;

                if (/^\[.+\]$/.test(name)) {
                    name = name.slice(1, -1);
                }

                return this._context[name];
            }
        }

        Literal(ctx) {
            if (ctx.StringLiteral) {
                return ctx.StringLiteral[0].image.slice(1, -1);
            }

            if (ctx.NumberLiteral) {
                return parseInt(ctx.NumberLiteral[0].image, 10);
            }

            if (ctx.True) {
                return true;
            }

            if (ctx.False) {
                return false;
            }

            if (ctx.Null) {
                return null;
            }
        }
    }

    return AuttoVisitor;
};

module.exports = visitorGenerator;