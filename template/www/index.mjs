import { Module, verify } from 'https://unpkg.com/zkwasm@0.1.6?module';
import { processLines, lines } from './preview.mjs';

const res = await fetch('/pkg/release.wasm');
const binary = await res.arrayBuffer();

processLines(lines);

console.log(binary);

export const m = await Module.fromBinary(binary);
console.log(m);

let result = await m.invokeExport('greet', [new TextEncoder().encode('John')]);

console.log(result);

console.log(await verify(result.proof));

// Simple example of how to encode a number as a Uint8Array

function encodeInt32(number) {
  const buffer = new ArrayBuffer(4);
  const u32 = new Uint32Array(buffer);
  u32[0] = number;

  return new Uint8Array(buffer);
}

let number1 = encodeInt32(8);
let number2 = encodeInt32(7);
let number3 = encodeInt32(5);
let result3 = await m.invokeExport('add', [number1, number2]);
let result4 = await m.invokeExport('add', [number1, number3]);
console.log(result3);

console.log(await verify(result3.proof));

console.log(await verify({ bytes: result3.proof.bytes, inputs: result4.proof.inputs }));
