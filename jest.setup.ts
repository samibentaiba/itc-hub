import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock Next.js server components
jest.mock("next/server", () => ({
  NextRequest: class MockNextRequest {
    url: string;
    method: string;
    body: string | null;
    headers: Map<string, string>;

    constructor(url: string, init: { method?: string; body?: string } = {}) {
      this.url = url;
      this.method = init.method || "GET";
      this.body = init.body || null;
      this.headers = new Map();
    }

    json() {
      return Promise.resolve(JSON.parse(this.body || "{}"));
    }
  },
  NextResponse: class MockNextResponse {
    status: number;
    _body: any;

    constructor(body: any, init: { status?: number } = {}) {
      this.status = init.status || 200;
      this._body = body;
    }

    json() {
      return Promise.resolve(this._body);
    }

    static json(data: any, init: { status?: number } = {}) {
      return new MockNextResponse(data, init);
    }
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-123"),
}));

// Mock console.error to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
