// ---------------
// Internal functions please do not change
// skip down until the example exports
// ---------------

type HostBuffer = u32;

// @ts-ignore decorators
@external("env", "log_buffer_as_string")
declare function __log(hostBufferPtr: u32): void;
function log(msg: string): void {
  __log(arrToHostBuffer(Uint8Array.wrap(String.UTF8.encode(msg))));
}

// @ts-ignore decorators
@external("env", "buffer")
declare function __new_buffer(): u32;

function hostBufferLen(hostBuffer: u32): u32 {
    return i32.load(hostBuffer);
}

function hostBufferPtr(hostBuffer: u32): u32 {
  return i32.load(hostBuffer + 4);
}

function hostBufferToArr(hostBuffer: HostBuffer): Uint8Array {
  let result = new Uint8Array(hostBufferLen(hostBuffer));
  for (let i: u32 = 0; i < hostBufferLen(hostBuffer); i++) {
    result[i] = i32.load8_u(hostBufferPtr(hostBuffer) + i);
  }

  return result;
}

function arrToHostBuffer(arr: Uint8Array): HostBuffer {
  let result = __new_buffer();

  let asBufferPtr = changetype<u32>(arr.buffer);

  i32.store(result, arr.byteLength as u32);
  i32.store(result + 4, asBufferPtr);

  return result;
}

function concat(left: string, right: string): string {
  let leftArr = Uint8Array.wrap(String.UTF8.encode(left));
  let rightArr = Uint8Array.wrap(String.UTF8.encode(right));
  let resultArr = new Uint8Array(leftArr.byteLength + rightArr.byteLength);
  for (let i = 0; i < leftArr.byteLength; i++) {
    resultArr[i] = leftArr[i];
  }
  for (let i = leftArr.byteLength; i < resultArr.byteLength; i++) {
    resultArr[i] = rightArr[i - leftArr.byteLength];
  }
  return String.UTF8.decode(resultArr.buffer);
}

// ---------------
// External exports
// ---------------

// Example exports
// This is used to generate the proof of execution and can be called by the client

export function greet(nameHostBuffer: HostBuffer): void {
  let name = String.UTF8.decode(hostBufferToArr(nameHostBuffer).buffer);
  let msg = concat('hello ', name);
  log(msg);
}

export function add(number1Buffer: HostBuffer, number2Buffer: HostBuffer): void {
  const number1 = Uint32Array.wrap(hostBufferToArr(number1Buffer).buffer)[0];
  // achieves the same as above

  const number2 = i32.load(hostBufferPtr(number2Buffer));
  const result = number1 + number2;
  let msg = concat('Total: ', result.toString());
  log(msg);
}
