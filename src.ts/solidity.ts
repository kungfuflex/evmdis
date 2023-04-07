'use strict';

import { padToBytes2 } from "./util";
import { difference } from "lodash";

export const decorateJumps = (segmented) => {
  const dests = difference(Object.keys(segmented), ['unreachable']);
  dests.forEach((jumpdest) => {
    segmented[jumpdest].forEach(([ instruction, byte, data ], i, ary) => {
      if (instruction === 'JUMPI') {
        const dest = padToBytes2(ary[i - 1][2]);
        ary[i].jumpdest = dest;
      }
    });
  });
  return segmented;
};
