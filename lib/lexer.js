const _ = require('lodash');
const chevrotain = require('chevrotain');

const Tokens = require('./tokens');

const Lexer = chevrotain.Lexer;
class AuttoLexer extends Lexer {
    constructor(config) {
        super(Tokens.all, _.merge({
            positionTracking: "onlyStart",

            // Adds tokenClassName property to the output for easier debugging in the playground
            // Do not use this flag in a productive env, as it will hurt performance.
            debug: true
        }, config));
    }
}

module.exports = AuttoLexer;