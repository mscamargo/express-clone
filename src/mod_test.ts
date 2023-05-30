import { assertSpyCalls, spy } from "https://deno.land/std/testing/mock.ts";
import { Layer, Response, chain } from "./mod.ts";

Deno.test("chain", async () => {
  const middleware1: Layer["handler"] = async (request, response, next) => {
    await next()
  };

  const route1: Layer["handler"] = async (request, response) => {
  };

  const spyMiddleware1 = spy(middleware1);
  const spyRoute1 = spy(route1);

  const stack: Layer[] = [
    {
      path: "/",
      method: "GET",
      handler: spyMiddleware1,
    },
    {
      path: "/",
      method: "GET",
      handler: spyRoute1,
    },
  ];

  await chain(stack)(new Request("http://localhost:3000"), new Response());

  assertSpyCalls(spyMiddleware1, 1);
  assertSpyCalls(spyRoute1, 1);
});
