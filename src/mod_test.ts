import { serve } from "https://deno.land/std/http/server.ts";
import { assertEquals, assertExists, assertInstanceOf } from "https://deno.land/std/testing/asserts.ts";
import { handler } from "./mod.ts";

Deno.test("/todo (POST)", async () => {
  const abortController = new AbortController();
  const serverPromise = serve(handler, {
    signal: abortController.signal,
  });

  const url = "http://localhost:8000/todo";


  const requestBody = {
    title: "",
    description: "",
  }

  const request = new Request(url, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const response = await fetch(request);

  const responseBody = await response.json();
  assertEquals(response.status, 201)
  assertExists(responseBody.id)
  assertEquals(responseBody.title, requestBody.title)
  assertEquals(responseBody.description, requestBody.description)
  abortController.abort();
  await serverPromise;
});

Deno.test("/todo (GET)", async () => {
  const abortController = new AbortController();
  const serverPromise = serve(handler, {
    signal: abortController.signal,
  });

  const url = "http://localhost:8000/todo";

  const request = new Request(url, {
    method: "GET",
    headers: {
      'content-type': 'application/json'
    }
  });

  const response = await fetch(request);


  const responseBody = await response.json();
  assertEquals(response.status, 200)
  assertInstanceOf(responseBody, Array)
  abortController.abort();
  await serverPromise;
});
