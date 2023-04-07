#!/usr/bin/env node

const { argv } = require('yargs');
const [ filename ] = argv._;
const fs = require('fs-extra');
const addHexPrefix = (s) => s.substr(0, 2).toLowerCase() === '0x' ? s : '0x' + s;
const instructions = require('./evm');
const leftZeroPad = (s, n) => Array(Math.max(1, n - s.length + 1)).join('0') + s;
(async () => {
  const bytes = addHexPrefix(await fs.readFile(filename || 0, 'utf8')).substr(2).toLowerCase().trim();
  if (!bytes) throw Error('Supply a file or pipe input to program');
  const bytesArray = Array.apply(null, { length: bytes.length / 2 }).map((_, i) => bytes.substr(i*2, 2));
  let i = 0;
  const seqs = [];
  while (i < bytesArray.length) {
    const op = instructions[bytesArray[i]] || ['INVALID', 0];
    const addrHex = i.toString(16);
    const bytesAppended = bytesArray.slice(i + 1, i + 1 + op[op.length - 1]).join('');
    seqs.push([ addHexPrefix(leftZeroPad(addrHex, addrHex.length + (addrHex.length % 2))), op[0], (bytesAppended ? '0x' + bytesAppended : '')]);
    i += 1 + op[op.length - 1];
  }
  seqs.forEach(([ addrHex, op, bytes ]) => console.log(addrHex + ' ' + op + (bytes.length ? ' ' : '') + bytes));
})().catch((err) => console.error(err.stack));
