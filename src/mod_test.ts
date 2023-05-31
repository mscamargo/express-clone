import { ConnInfo, Handler } from "https://deno.land/std/http/server.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const handler: Handler = (request) => {
  const method = request.method.toLowerCase();
  switch (method) {
    case "get":
      return new Response("ping: GET");
    case "post":
      return new Response("ping: POST");
    case "put":
      return new Response("ping: PUT");
  }
  return new Response("pong");
};

Deno.test("Should handle Http Methods", async (t) => {
  await t.step("GET", async () => {
    const request = new Request("http://localhost:3000/ping", {
      method: "get",
    });
    const response = await handler(request, {} as ConnInfo);
    const body = await response.text();
    assertEquals(body, "ping: GET");
  });

  await t.step("POST", async () => {
    const request = new Request("http://localhost:3000/ping", {
      method: "post",
    });
    const response = await handler(request, {} as ConnInfo);
    const body = await response.text();
    assertEquals(body, "ping: POST");
  });

  await t.step("PUT", async () => {
    const request = new Request("http://localhost:3000/ping", {
      method: "put",
    });
    const response = await handler(request, {} as ConnInfo);
    const body = await response.text();
    assertEquals(body, "ping: PUT");
  });
});
