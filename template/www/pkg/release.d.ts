/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/greet
 * @param nameHostBuffer `u32`
 */
export declare function greet(nameHostBuffer: number): void;
/**
 * assembly/index/add
 * @param number1Buffer `u32`
 * @param number2Buffer `u32`
 */
export declare function add(number1Buffer: number, number2Buffer: number): void;
