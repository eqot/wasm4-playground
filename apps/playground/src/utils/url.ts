import { getInitialFiles, CodeFile } from "../languages";

/**
 * Sets the program information to the URL.
 * @param program The program object containing the language and files.
 */
export function setProgramToUrl(program: { language: string; files?: CodeFile[] }): void {
  const baseUrl = location.origin;

  const params = new URLSearchParams(location.search);
  params.set("lang", program.language);

  const files = program.files?.filter((file) => !file.name.startsWith("wasm4."));

  if (program.files) {
    params.set("files", encodeURIComponent(JSON.stringify(files)));
  } else {
    params.delete("files");
  }

  const url = `${baseUrl}/?${params.toString()}`;
  history.replaceState(null, "", url);
}

/**
 * Retrieves the program information from the URL parameters.
 * @returns An object containing the language and files information.
 */
export function getProgramFromUrl() {
  const params = new URLSearchParams(location.search);

  const language = params.get("lang");
  if (!language) return;

  const files = JSON.parse(decodeURIComponent(params.get("files")!));
  if (!files) return;
  if (files.every((file: CodeFile) => !file.name.startsWith("wasm4."))) {
    const wasmFile = getInitialFiles(language).filter((file) => file.name.startsWith("wasm4."));
    if (wasmFile && wasmFile[0]) {
      files.push(wasmFile[0]);
    }
  }

  return { language, files };
}
