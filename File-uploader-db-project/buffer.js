// Simple Buffer usage examples

// Create a Buffer from a string
const fromString = Buffer.from('Hello buffer', 'utf8');
console.log('fromString:', fromString, fromString.toString('utf8'));

// Allocate a Buffer of fixed size and fill
const allocated = Buffer.alloc(8, 0x41); // 'A'
console.log('allocated:', allocated, allocated.toString('utf8'));

// Concatenate Buffers
const combined = Buffer.concat([fromString, Buffer.from(' + more')]);
console.log('combined:', combined.toString('utf8'));

// Write into an existing Buffer
const target = Buffer.alloc(12);
target.write('Node.js', 0, 'utf8');
console.log('target after write:', target.toString('utf8'));

// Copy and overwrite slices between buffers
const wordBuf = Buffer.from('Banana Nananana');
const catchBuf = Buffer.from('Not sure Turtle!');

wordBuf.copy(catchBuf); // overwrite beginning with full wordBuf content
catchBuf.write('Not sure Turtle!'); // rewrite original text
wordBuf.copy(catchBuf, 0, 7, wordBuf.length); // copy slice starting at offset 7

console.log('catchBuf result:', catchBuf.toString());

module.exports = {
  fromString,
  allocated,
  combined,
  target,
  wordBuf,
  catchBuf,
};

