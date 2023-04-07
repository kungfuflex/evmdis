'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = exports.annotateSegment = exports.extractLabel = exports.lookupTable = void 0;
const evm_1 = __importDefault(require("./evm"));
exports.lookupTable = Object.keys(evm_1.default).reduce((r, byte) => {
    r[evm_1.default[byte][0]] = { pop: evm_1.default[byte][2], push: evm_1.default[byte][3], dataSize: evm_1.default[byte][4] };
    return r;
}, {});
function extractLabel(v) {
    return v.split('(')[0];
}
exports.extractLabel = extractLabel;
function annotateSegment(segment) {
    let ptr = 0;
    let vars = 0;
    let stack = [];
    let shallow = 0;
    const fillStack = (depth) => {
        const len = Math.max(depth - stack.length, 0);
        for (let i = 0; i < len; i++) {
            shallow++;
            stack.push('arg' + String(shallow));
        }
    };
    const popStack = () => {
        if (!stack.length) {
            shallow++;
            stack.push('arg' + String(shallow));
        }
        return stack.shift();
    };
    const pushStack = (annotation) => {
        vars++;
        stack.unshift('local' + String(vars) + (annotation && '(' + annotation + ')' || ''));
    };
    segment.forEach((v) => {
        const [instruction, data] = v;
        const lookup = exports.lookupTable[instruction] || { pop: 0, push: 0 };
        fillStack(lookup.pop);
        if (instruction.match('DUP')) {
            const dupArg = Number(instruction.substr(3));
            fillStack(dupArg);
            stack.unshift(stack[dupArg - 1]);
        }
        else if (instruction.match('PUSH')) {
            stack.unshift(data);
        }
        else if (instruction.match('SWAP')) {
            const swapArg = Number(instruction.substr(4));
            fillStack(swapArg + 1);
            const placeHolder = stack[swapArg - 1];
            stack[swapArg - 1] = stack[0];
            stack[0] = placeHolder;
        }
        else if (instruction === 'POP') {
            stack.shift();
        }
        else {
            let annotation = '';
            if (instruction === 'ADD')
                annotation = extractLabel(stack[0]) + '+' + extractLabel(stack[1]);
            else if (instruction === 'SUB')
                annotation = extractLabel(stack[0]) + '-' + extractLabel(stack[1]);
            else if (instruction === 'MUL')
                annotation = extractLabel(stack[0]) + '*' + extractLabel(stack[1]);
            else if (instruction === 'DIV')
                annotation = extractLabel(stack[0]) + '/' + extractLabel(stack[1]);
            else if (instruction === 'ADDMOD')
                annotation = extractLabel(stack[0]) + '%+' + extractLabel(stack[1]);
            else if (instruction === 'MULMOD')
                annotation = extractLabel(stack[0]) + '%*' + extractLabel(stack[1]);
            else if (instruction === 'EXP')
                annotation = extractLabel(stack[0]) + '**' + extractLabel(stack[1]);
            else if (instruction === 'AND')
                annotation = extractLabel(stack[0]) + '&' + extractLabel(stack[1]);
            else if (instruction === 'OR')
                annotation = extractLabel(stack[0]) + '|' + extractLabel(stack[1]);
            else if (instruction === 'XOR')
                annotation = extractLabel(stack[0]) + '^' + extractLabel(stack[1]);
            else if (instruction === 'MLOAD')
                annotation = 'mem[' + extractLabel(stack[0]) + ']';
            else if (instruction === 'SLOAD')
                annotation = 'stor[' + extractLabel(stack[0]) + ']';
            else if (instruction === 'CALLDATALOAD')
                annotation = 'calldata[' + stack[0] + ']';
            Array(lookup.pop).fill(0).forEach(() => popStack());
            if (lookup.push)
                pushStack(annotation);
        }
        v.push(stack.slice());
    });
}
exports.annotateSegment = annotateSegment;
function annotate(disasm) {
    const keys = Object.keys(disasm).filter((v) => v !== 'unreachable');
    keys.forEach((v) => {
        annotateSegment(disasm[v]);
    });
    return disasm;
}
exports.annotate = annotate;
//# sourceMappingURL=annotate.js.map