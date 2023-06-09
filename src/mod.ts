export const handler = async (
  request: Request,
): Promise<Response> => {
  if (request.method === "POST") {
    const cType = request.headers.get("content-type");
    const body = cType === "application/json"
      ? await request.json()
      : await request.text();
    body.id = crypto.randomUUID();
    return new Response(JSON.stringify(body), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  if (request.method === "GET") {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response("404", {
    status: 404,
  });
};
