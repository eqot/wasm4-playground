import { describe, it, expect } from "vitest";

import { compile } from "../src/index";

import defaultCode from "./assets/default.wat?raw";
import sampleCode from "./assets/sample.wat?raw";

const testCode = defaultCode + sampleCode;

describe("compile()", () => {
  it("should return expected binary from the code", async () => {
    const result = await compile([{ name: "test.wat", code: testCode }]);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).matchSnapshot();
  });

  it("should return undefined if the code is invalid", async () => {
    const result = await compile("");
    expect(result).toBeUndefined();
  });
});
