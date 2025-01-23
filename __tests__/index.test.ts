import { test, expect } from "vitest";

const sum = (a: number, b: number): number => a+b;


test("add 1+2 = 3", () => {
    expect(sum(1, 2)).toBe(3);
})

