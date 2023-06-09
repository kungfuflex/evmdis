'use strict';
import { difference } from "lodash";
export function isExecutionHalt(instruction) {
  return ['JUMP', 'RETURN', 'STOP', 'REVERT', 'INVALID'].includes(instruction);
}

export function padToBytes2(hex) {
  if (hex.substr(0, 2) === '0x') hex = hex.substr(2);
  return '0x' + '0'.repeat(4 - Math.min(4, hex.length)) + hex;
}

export function strip(instructions) {
  instructions.forEach((v) => {
    if (v[0].match('PUSH')) v.splice(1, 1);
    else v.splice(1, 2);
  });
}

export function stripReachable(jumpdests) {
  const dests = difference(Object.keys(jumpdests), ['unreachable']);
  dests.forEach((v) => {
    strip(jumpdests[v]);
  });
  return jumpdests;
}
