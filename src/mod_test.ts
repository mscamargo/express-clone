import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { listen, stop } from "./mod.ts";

Deno.test("Should handle Http Methods", async (t) => {
  await listen(3000)
  await t.step("GET", async () => {
    const url = "http://localhost:3000/ping";
    const response = await fetch(url, { method: "GET" });
    const body = await response.text();
    assertEquals(body, "ping: GET");
  });

  await t.step("POST", async () => {
    const url = "http://localhost:3000/ping";
    const response = await fetch(url, { method: "POST" });
    const body = await response.text();
    assertEquals(body, "ping: POST");
  });

  await t.step("PUT", async () => {
    const url = "http://localhost:3000/ping";
    const response = await fetch(url, { method: "PUT" });
    const body = await response.text();
    assertEquals(body, "ping: PUT");
  });
  stop()
});
