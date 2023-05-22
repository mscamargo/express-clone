import { serve } from "https://deno.land/std/http/server.ts";
type Handler = (
  request: Request,
  response: Response,
  next?: () => void,
) => Promise<Response>;

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
  const response = new Response();
  response.body = "";
  chain(request, response);
  return response;
});

// NOTE: i'm gonna need custom Request and Response objects
