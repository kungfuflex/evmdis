'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateUnreachableSegments = exports.segment = exports.push = void 0;
const util_1 = require("./util");
function push(jumpdests, dest, instruction, byte, data) {
    dest.forEach((v) => {
        const dict = v.match(/^unreachable/) ? jumpdests.unreachable : jumpdests;
        const segment = dict[v] = dict[v] || [];
        segment.push([instruction, byte, data]);
    });
}
exports.push = push;
function segment(disasm) {
    const jumpdests = { unreachable: {} };
    let dest = ['entry'];
    let func = null;
    let unreachableSegments = 0;
    for (const [instruction, byte, offset, data] of disasm) {
        if (instruction === 'JUMPDEST') {
            if (dest[0].match(/^unreachable/))
                dest = [];
            dest.push((0, util_1.padToBytes2)(offset));
        }
        push(jumpdests, dest, instruction, byte, data);
        if ((0, util_1.isExecutionHalt)(instruction)) {
            dest = ['unreachable' + String(unreachableSegments)];
            if (!dest[0].match(/^unreachable/)) {
                unreachableSegments++;
            }
        }
    }
    decorateUnreachableSegments(jumpdests.unreachable);
    return jumpdests;
}
exports.segment = segment;
function decorateUnreachableSegments(unreachables) {
    Object.keys(unreachables).forEach((v) => {
        unreachables[v].toBytes = function () {
            return ('0x' + this.reduce((r, v) => {
                return r + v[1].substr(2), v[2].substr(2);
            }, ''));
        };
    });
}
exports.decorateUnreachableSegments = decorateUnreachableSegments;
//# sourceMappingURL=segment.js.map