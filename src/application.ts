export type HttpMethod = "ALL" | "GET" | "POST";

type NextFunction = () => Promise<void>;

export type Handler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

export class Layer {
  constructor(
    readonly path: string,
    readonly method: HttpMethod,
    readonly handler: Handler,
  ) {
  }
}

export class CustomResponse {
  #status = 200;
  #headers: Record<string, string> = {};

  #body: any;

  set status(value: number) {
    this.#status = value;
  }

  get status() {
    return this.#status;
  }

  set body(value: any) {
    this.#body = value;
  }

  get body() {
    return this.#body;
  }

  set(headers: Record<string, string>): void;
  set(name: string, value: string): void;
  set(headersOrName: Record<string, string> | string, value?: string): void {
    if (typeof headersOrName === "string") {
      this.#headers[headersOrName] = value ?? "";
    } else {
      this.#headers = {
        ...this.#headers,
        ...headersOrName,
      };
    }
  }
}

export class Application {
  #stack: Layer[];

  constructor(stack: Layer[] = []) {
    this.#stack = stack;
  }

  use(handler: Handler) {
    this.#stack.push(new Layer("*", "ALL", handler));
  }

  get(path: string, ...handlers: Handler[]) {
    const layers = handlers.map((handler) => new Layer(path, "GET", handler));
    this.#stack.push(...layers);
  }
}
