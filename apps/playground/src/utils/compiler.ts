import { compile as compileAs } from "compiler-as";
import { compile as compileWat } from "compiler-wat";

import { Language } from "../languages";
import type { Program } from "../views/RootView";

// Note: Since Vite seems to have a build issue with workers, we're not using them for now.
// import CompileWorker from "../workers/compileWorker?worker";

// export async function startCompile(program: Program): Promise<Uint8Array | undefined> {
//   // AssemblyScript is compiled in the main thread.
//   if (program.language === Language.AssemblyScript) return compileAs(program.files);

//   return new Promise((resolve, reject) => {
//     const worker = new CompileWorker();
//     worker.onmessage = (event) => {
//       if (!event.data) reject();

//       resolve(event.data);
//     };
//     worker.postMessage({ program });
//   });
// }

/**
 * Compiles the given code files into WebAssembly bytecode.
 *
 * @param language The programming language of the code files.
 * @param code The array of code files to compile.
 * @returns A promise that resolves to the compiled WebAssembly bytecode as a Uint8Array, or undefined if compilation fails.
 */
export async function compile(program: Program): Promise<Uint8Array | undefined> {
  switch (program.language) {
    case Language.AssemblyScript:
      return compileAs(program.files);

    case Language.WebAssemblyText:
      return compileWat(program.files);

    default:
      break;
  }
}
