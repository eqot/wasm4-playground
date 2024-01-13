import { describe, it, expect } from "vitest";

import { compile } from "../src/index";

import testCode from "./assets/sample.ts?raw";

describe("compile()", () => {
  it("should return expected binary from the code", async () => {
    const result = await compile(testCode);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).matchSnapshot();
  });

  it("should return undefined if the code is invalid", async () => {
    const result = await compile("");
    expect(result).toBeUndefined();
  });
});
