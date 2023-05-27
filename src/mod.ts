import { serve } from "https://deno.land/std/http/server.ts";

type PlatformResponse = globalThis.Response;

class Response {
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

  toPlatformResponse() {
    // converts the response to the platform response
    // but, how?
  }
}

type Handler = (
  request: Request,
  response: Response,
  next?: () => void,
) => Promise<Response>;

function matchLayer(layer: Layer, url: string, method: string): boolean {
  if (layer.path === "*" && layer.method === "*") {
    return true;
  }
  const pattern = new URLPattern({ pathname: layer.path });

  const matchPath = !!pattern.exec(url);
  const matchMethod = layer.method === method || method === "*";

  return matchPath && matchMethod;
}

type Layer = {
  path: string;
  method: string;
  handler: Handler;
};

const stack: Array<Layer> = [];

const chain = (request: Request, response: Response) => {
  let nextIndex = 0;
  const next = () => {
    if (nextIndex < stack.length) {
      const nextLayer = stack[nextIndex++];
      if (
        matchLayer(nextLayer, request.url, request.method)
      ) {
        nextLayer.handler(request, response, next);
      } else {
        next();
      }
    }
  };
  return next();
};

serve((request) => {
  const modResponse = new Response();
  chain(request, modResponse);
  return new Response(modResponse.body, { status: modResponse.statusCode });
});

// NOTE: i'm gonna need custom Request and Response objects
