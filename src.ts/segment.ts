'use strict';
import { isExecutionHalt, padToBytes2 } from "./util";
  
export function push(jumpdests, dest, instruction, byte, data) {
  dest.forEach((v) => {
    const dict = v.match(/^unreachable/) ? jumpdests.unreachable : jumpdests;
    const segment = dict[v] = dict[v] || [];
    segment.push([ instruction, byte, data ]);
  });
}

export function segment(disasm) {
  const jumpdests = { unreachable: {} };
  let dest = ['entry'];
  let func = null;
  let unreachableSegments = 0;
  for (const [ instruction, byte, offset, data ] of disasm) {
    if (instruction === 'JUMPDEST') {
      if (dest[0].match(/^unreachable/)) dest = [];
      dest.push(padToBytes2(offset));
    }
    push(jumpdests, dest, instruction, byte, data);
    if (isExecutionHalt(instruction)) {
      dest = ['unreachable' + String(unreachableSegments) ];
      if (!dest[0].match(/^unreachable/)) {
        unreachableSegments++;
      }
    }
  }
  decorateUnreachableSegments(jumpdests.unreachable);
  return jumpdests;
}

export function decorateUnreachableSegments(unreachables) {
  Object.keys(unreachables).forEach((v) => {
    unreachables[v].toBytes = function () {
      return ('0x' + this.reduce((r, v) => {
        return r + v[1].substr(2), v[2].substr(2);
      }, ''));
    };
  });
}
