import asconfig from "./asconfig.json?raw";

export type CodeFile = {
  name: string;
  code: string;
};

let importedAsc: any = null;

/**
 * Compiles the given code into a WebAssembly module.
 * @param code The code to compile.
 * @returns A promise that resolves to a Uint8Array representing the compiled WebAssembly module, or undefined if compilation fails.
 */
export async function compile(files: CodeFile[]): Promise<Uint8Array | undefined> {
  return new Promise(async (resolve) => {
    if (!importedAsc) importedAsc = await importAsc();

    const asc = importedAsc;
    if (!asc) return;

    const input: { [key: string]: Uint8Array | string } = {};
    input["asconfig.json"] = asconfig;
    for (const file of files) {
      input["src/" + file.name] = file.code;
    }

    const output: { [key: string]: Uint8Array | string } = {};

    const stdout = asc.createMemoryStream();
    const stderr = asc.createMemoryStream();

    asc.main(
      ["-O3", "--runtime", "stub", "--binaryFile", "wasm", "--textFile", "wat"],
      {
        stdout,
        stderr,
        readFile(name: string, _baseDir: string) {
          // console.log("Read", name);
          return input[name];
        },
        writeFile(name: string, data: any, _baseDir: string) {
          output[name] = data;
        },
        listFiles(_dirname: string, _baseDir: string) {
          return [];
        },
      },
      (error: any) => {
        // console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
        // console.log(`>>> STDERR >>>\n${stderr.toString()}`);

        if (!error) {
          if (output.wasm instanceof Uint8Array) resolve(output.wasm);
        } else {
          console.log(">>> THROWN >>>");
          console.log(error);
        }
      },
    );
  });
}

async function importAsc(): Promise<any> {
  await loadRequireJs();

  return new Promise((resolve) => {
    // @ts-ignore
    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], (module: any) => {
      module.asc.ready.then(() => resolve(module.asc));
    });
  });
}

async function loadRequireJs(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.min.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
