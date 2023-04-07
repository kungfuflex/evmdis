'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leftZeroPad = exports.addHexPrefix = void 0;
const evm_1 = __importDefault(require("./evm"));
function addHexPrefix(s) {
    return s.substr(0, 2).toLowerCase() === '0x' ? s : '0x' + s;
}
exports.addHexPrefix = addHexPrefix;
function leftZeroPad(s, n) {
    return Array(Math.max(1, n - s.length + 1)).join('0') + s;
}
exports.leftZeroPad = leftZeroPad;
function dis(bytes) {
    bytes = addHexPrefix(bytes).substr(2);
    const bytesArray = Array.apply(null, { length: bytes.length / 2 }).map((_, i) => bytes.substr(i * 2, 2));
    let i = 0;
    const seqs = [];
    while (i < bytesArray.length) {
        const op = evm_1.default[bytesArray[i]] || ['INVALID', 0];
        const addrHex = i.toString(16);
        const bytesAppended = bytesArray.slice(i + 1, i + 1 + op[op.length - 1]).join('');
        seqs.push([addHexPrefix(leftZeroPad(addrHex, addrHex.length + (addrHex.length % 2))), op[0], (bytesAppended ? '0x' + bytesAppended : ''), addHexPrefix(bytesArray[i])]);
        i += 1 + op[op.length - 1];
    }
    return seqs.map(([addrHex, op, bytes, opByte]) => [op, opByte, addrHex, addHexPrefix(bytes)]);
}
exports.default = dis;
;
//# sourceMappingURL=dis.js.map