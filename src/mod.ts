let listener: Deno.Listener;

const handler = (request: Request): Response | Promise<Response> => {
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

export async function listen(port: number) {
  listener = Deno.listen({ port });
  for await (const connection of listener) {
    const httpConnection = Deno.serveHttp(connection);
    for await (const requestEvent of httpConnection) {
      const response = await handler(requestEvent.request);
      requestEvent.respondWith(response);
    }
  }
}

export function stop() {
    listener?.close()
}
