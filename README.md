# kool-evmdis

Usage:

```js
var disasm = require('kool-evmdis');
const ops = disasm('0x601010');
/*
[ [ 'PUSH1', '0x60', '0x00', '0x10' ],
  [ 'LT', '0x10', '0x02', '0x' ] ] */
```

Returns an array of opcodes and any additional data they come with

Item 1) opcode name
Item 2) actual opcode byte (included for easy reasm)
Item 3) Program counter upon reaching this opcode
Item 4) Additional data (only relevant for PUSH instructions, otherwise is 0x)
