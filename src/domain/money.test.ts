import { expect, test, describe } from "vitest";
import { formatCents, parseAmountToCents } from "./money";

describe("parseAmountToCents", () => {
  test.each([
    ["11,1", 1110],
    ["34,11", 3411],
    ["3400,11", 340011],
    ["11.1", 1110],
    ["34.11", 3411],
    ["3400.11", 340011],
    ["1", 100],
    ["111", 11100],
    ["3411", 341100],
    ["340011", 34001100],
  ])("parses %s as %i cents", (arg, expected) => {
    expect(parseAmountToCents(arg)).toBe(expected);
  });
});

test("formatCents should return values in the pt-BR local format", () => {
  expect(formatCents(1111)).toBe("R$\u00a011,11");
});
