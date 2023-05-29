'use strict';

import { stripReachable } from ".//util";
import { decorateJumps } from "./solidity";
import { segment } from "./segment";
import { annotate } from "./annotate";
import dis from "./dis";

export function disassembleAndSegment(bytecode) {
  return annotate(stripReachable(decorateJumps(segment(dis(bytecode)))));
}

export function disassemble(bytecode) {
  return dis(bytecode);
}
