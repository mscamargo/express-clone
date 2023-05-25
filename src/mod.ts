import { serve } from "https://deno.land/std/http/server.ts";

class ModResponse {
  #statusCode = 500;
  #body: any;

  set statusCode(statusCode: number) {
    this.#statusCode = statusCode;
  }

  get statusCode(): number {
    return this.#statusCode;
  }

  set body(body: any) {
    this.#body = body;
  }

  get body() {
    return this.#body;
  }
}

type Handler = (
  request: Request,
  response: ModResponse,
  next?: () => void,
) => Promise<Response>;

type Layer = {
  path: string;
  method: string;
  handler: Handler;
};

const stack: Array<Layer> = [];

const chain = (request: Request, response: ModResponse) => {
  let nextIndex = 0;
  const next = () => {
    if (nextIndex < stack.length) {
      const nextHandler = stack[nextIndex++];
      const { path, method, handler } = nextHandler;
      const { pathname } = new URL(request.url, "http://localhost");
      if (
        (pathname === path || path === "*") &&
        (request.method === method || method === "*")
      ) {
        handler(request, response, next);
      } else {
        next();
      }
    }
  };
  return next();
};

serve((request) => {
  const modResponse = new ModResponse();
  chain(request, modResponse);
  return new Response(modResponse.body, { status: modResponse.statusCode });
});

// NOTE: i'm gonna need custom Request and Response objects
