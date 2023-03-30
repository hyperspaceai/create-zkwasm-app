import { Module, verify } from "https://unpkg.com/zkwasm@0.1.6?module";

const res = await fetch("/pkg/release.wasm");
const binary = await res.arrayBuffer();

console.log(binary);

let m = await Module.fromBinary(binary);
console.log(m);

let result = await m.invokeExport("greet", [new TextEncoder().encode("John")]);

console.log(result);

console.log(await verify(result.proof));
