import fileOfMainTs from "./assets/code/main.ts?raw";
import fileOfWasm4Ts from "./assets/code/wasm4.ts?raw";
import fileOfMainWat from "./assets/code/main.wat?raw";
import fileOfWasm4Wat from "./assets/code/wasm4.wat?raw";

export const Language = {
  AssemblyScript: "AssemblyScript",
  WebAssemblyText: "WebAssemblyText",
};

export type Language = (typeof Language)[keyof typeof Language];

export type CodeFile = {
  name: string;
  code: string;
};

const LANGUAGE_INFO: { [language: string]: { files: CodeFile[] } } = {
  AssemblyScript: {
    files: [
      { name: "main.ts", code: fileOfMainTs },
      { name: "wasm4.ts", code: fileOfWasm4Ts },
    ],
  },
  WebAssemblyText: {
    files: [
      { name: "main.wat", code: fileOfMainWat },
      { name: "wasm4.wat", code: fileOfWasm4Wat },
    ],
  },
};

export function getInitialFiles(language: Language): CodeFile[] {
  return LANGUAGE_INFO[language].files;
}
