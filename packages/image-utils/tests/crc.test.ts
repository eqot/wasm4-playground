import { describe, it, expect } from "vitest";

import { getCrc } from "../src/crc";

describe("getCrc()", () => {
  it("should return the expected CRC value", () => {
    const data = [1, 2, 3, 4, 5];
    const result = getCrc(data);
    expect(result).toBe(1191942644);
  });
});
