import { describe, it, expect } from "vitest";

import { getTextsFromImage, injectTextIntoImage } from "../src/png";

import testImageDataWithCode from "./fixtures/testImageWithCode.json";
import testImageDataWithoutCode from "./fixtures/testImageWithoutCode.json";
import testCode from "./fixtures/test.wat?raw";
import snakeCode from "./fixtures/snake.wat?raw";
import wasm4Code from "./fixtures/wasm4.wat?raw";

const testImageWithCode = Uint8Array.from(testImageDataWithCode).buffer;
const testImageWithoutCode = Uint8Array.from(testImageDataWithoutCode).buffer;

const programFiles = [
  { name: "main.wat", code: testCode },
  { name: "wasm4.wat", code: wasm4Code },
];

describe("getTextsFromImage()", () => {
  it("should return undefined if the buffer is not a PNG image", () => {
    const buffer = new ArrayBuffer(10);
    const result = getTextsFromImage(buffer);
    expect(result).toBeUndefined();
  });

  it("should return expected files extracted from the PNG image", () => {
    const texts = getTextsFromImage(testImageWithCode);
    const result = JSON.parse(texts![0]!);

    expect(result).toEqual({
      type: "code",
      language: "WebAssemblyText",
      files: programFiles,
    });
  });
});

describe("injectTextIntoImage()", () => {
  it("should return input image if text is a null string", () => {
    const result = injectTextIntoImage(testImageWithoutCode, "")?.buffer;
    expect(result).toEqual(testImageWithoutCode);
  });

  it("should return an expected PNG image with code", () => {
    const result = injectTextIntoImage(
      testImageWithoutCode,
      JSON.stringify({
        type: "code",
        language: "WebAssemblyText",
        code: testCode,
      }),
    )?.buffer;
    expect(result).toEqual(testImageWithCode);
  });
});

describe("injectTextIntoImage() and getTextsFromImage()", () => {
  it("should return the same program", () => {
    const injectedImage = injectTextIntoImage(
      testImageWithoutCode,
      JSON.stringify({
        type: "code",
        language: "WebAssemblyText",
        files: programFiles,
      }),
    )?.buffer;

    const texts = getTextsFromImage(injectedImage!);
    const result = JSON.parse(texts![0]!);
    expect(result).toEqual({
      type: "code",
      language: "WebAssemblyText",
      files: programFiles,
    });
  });

  it("should return the same code for snake", () => {
    const program = {
      type: "code",
      language: "WebAssemblyText",
      files: [
        { name: "snake.wat", code: snakeCode },
        { name: "wasm4.wat", code: wasm4Code },
      ],
    };

    const injectedImage = injectTextIntoImage(testImageWithoutCode, JSON.stringify(program))?.buffer;

    const texts = getTextsFromImage(injectedImage!);
    const result = JSON.parse(texts![0]!);
    expect(result).toEqual(program);
  });
});
