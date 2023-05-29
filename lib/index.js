'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disassemble = exports.disassembleAndSegment = void 0;
const util_1 = require(".//util");
const solidity_1 = require("./solidity");
const segment_1 = require("./segment");
const annotate_1 = require("./annotate");
const dis_1 = __importDefault(require("./dis"));
function disassembleAndSegment(bytecode) {
    return (0, annotate_1.annotate)((0, util_1.stripReachable)((0, solidity_1.decorateJumps)((0, segment_1.segment)((0, dis_1.default)(bytecode)))));
}
exports.disassembleAndSegment = disassembleAndSegment;
function disassemble(bytecode) {
    return (0, dis_1.default)(bytecode);
}
exports.disassemble = disassemble;
//# sourceMappingURL=index.js.map