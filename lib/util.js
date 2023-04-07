'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripReachable = exports.strip = exports.padToBytes2 = exports.isExecutionHalt = void 0;
const lodash_1 = require("lodash");
function isExecutionHalt(instruction) {
    return ['JUMP', 'RETURN', 'STOP', 'REVERT', 'INVALID'].includes(instruction);
}
exports.isExecutionHalt = isExecutionHalt;
function padToBytes2(hex) {
    if (hex.substr(0, 2) === '0x')
        hex = hex.substr(2);
    return '0x' + '0'.repeat(4 - Math.min(4, hex.length)) + hex;
}
exports.padToBytes2 = padToBytes2;
function strip(instructions) {
    instructions.forEach((v) => {
        if (v[0].match('PUSH'))
            v.splice(1, 1);
        else
            v.splice(1, 2);
    });
}
exports.strip = strip;
function stripReachable(jumpdests) {
    const dests = (0, lodash_1.difference)(Object.keys(jumpdests), ['unreachable']);
    dests.forEach((v) => {
        strip(jumpdests[v]);
    });
    return jumpdests;
}
exports.stripReachable = stripReachable;
//# sourceMappingURL=util.js.map