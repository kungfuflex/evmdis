'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateJumps = void 0;
const util_1 = require("./util");
const lodash_1 = require("lodash");
const decorateJumps = (segmented) => {
    const dests = (0, lodash_1.difference)(Object.keys(segmented), ['unreachable']);
    dests.forEach((jumpdest) => {
        segmented[jumpdest].forEach(([instruction, byte, data], i, ary) => {
            if (instruction === 'JUMPI') {
                const dest = (0, util_1.padToBytes2)(ary[i - 1][2]);
                ary[i].jumpdest = dest;
            }
        });
    });
    return segmented;
};
exports.decorateJumps = decorateJumps;
//# sourceMappingURL=solidity.js.map