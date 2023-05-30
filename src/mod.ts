export class Response {
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

type NextFunction = () => Promise<void>;
type MiddlewareHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;
type RouteHandler = (request: Request, response: Response) => Promise<void>;

type Handler = MiddlewareHandler | RouteHandler;

function matchLayer(layer: Layer, url: string, method: string): boolean {
  if (layer.path === "*" && layer.method === "ALL") {
    return true;
  }
  const pattern = new URLPattern({ pathname: layer.path });

  const matchPath = !!pattern.exec(url);
  const matchMethod = layer.method === method || method === "*";

  return matchPath && matchMethod;
}

export type HttpMethod = "ALL" | "GET" | "POST";

export type Layer = {
  path: string;
  method: HttpMethod;
  handler: Handler;
};

const stack: Array<Layer> = [];

export const chain =
  (stack: Layer[]) => async (request: Request, response: Response) => {
    let nextIndex = 0;
    const next = async () => {
      if (nextIndex < stack.length) {
        const nextLayer = stack[nextIndex++];
        if (
          matchLayer(nextLayer, request.url, request.method)
        ) {
          await nextLayer.handler(request, response, next);
        } else {
          await next();
        }
      }
    };
    return await next();
  };

// NOTE: i'm gonna need custom Request and Response objects
