import { assertEquals } from "https://deno.land/std@0.177.1/testing/asserts.ts";
import { Application, Layer } from "./application.ts";

Deno.test("should push the handler into the #stack", () => {
  const stack: Layer[] = [];
  const app = new Application(stack);
  app.use(async (request, response) => {});
  assertEquals(stack.length, 1);
});
