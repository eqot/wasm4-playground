import WABT from "wabt";

export type CodeFile = {
  name: string;
  code: string;
};

/**
 * Compiles the given code into a WebAssembly binary.
 * @param code The WebAssembly text code to compile.
 * @returns A promise that resolves to a Uint8Array representing the compiled binary, or undefined if compilation fails.
 */
export async function compile(files: CodeFile[]): Promise<Uint8Array | undefined> {
  if (files.length === 0) return;

  const code = files.reduce((acc: string, file) => file.code + acc, "");

  const wabt = await WABT();
  const module = await wabt.parseWat("cart.wat", code);
  if (!module) return;

  const binary = module.toBinary({ log: true });
  if (!binary) return;

  return binary.buffer;
}
