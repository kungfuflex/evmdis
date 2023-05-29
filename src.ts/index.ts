'use strict';

import { stripReachable } from ".//util";
import { decorateJumps } from "./solidity";
import { segment } from "./segment";
import { annotate } from "./annotate";
import dis from "./dis";

export default function disassemble(bytecode) {
  return annotate(stripReachable(decorateJumps(segment(dis(bytecode)))));
}

export function disassembleWithoutSegmentation(bytecode) {
  return dis(bytecode);
}
