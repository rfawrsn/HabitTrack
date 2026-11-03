export interface MockRequest {
  params: Record<string, string>;
  query: Record<string, unknown>;
  body: unknown;
  token: string | null;
  userId: string | null;
}

export interface MockResult {
  status: number;
  data?: unknown;
}

export class MockHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'MockHttpError';
    this.status = status;
  }
}

export function requireUserId(request: MockRequest): string {
  if (!request.userId) {
    throw new MockHttpError(401, 'Sesi Anda telah berakhir. Silakan masuk kembali.');
  }
  return request.userId;
}

export function asRecord(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new MockHttpError(400, 'Data yang dikirim tidak valid.');
  }
  return body as Record<string, unknown>;
}

export function readText(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string') {
    throw new MockHttpError(400, 'Data yang dikirim tidak lengkap.');
  }
  return value;
}

export function readOptionalText(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') {
    throw new MockHttpError(400, 'Data yang dikirim tidak valid.');
  }
  return value;
}
