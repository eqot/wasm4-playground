import { compile } from "../utils/compiler";

self.onmessage = async (event) => {
  const { program } = event.data;
  const wasm = await compile(program);
  self.postMessage(wasm);
};
