import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { readCollection } from '@/services/mock/mockDatabase';
import { MockHttpError, MockRequest } from '@/services/mock/mockRequest';
import { MOCK_ROUTES } from '@/services/mock/mockRoutes';
import { wait } from '@/utils/async';

const MOCK_LATENCY_MS = 400;
const BEARER_PREFIX = 'Bearer ';

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index];
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(pathParts[index]);
    } else if (part !== pathParts[index]) {
      return null;
    }
  }
  return params;
}

function findRoute(method: string, path: string) {
  for (const route of MOCK_ROUTES) {
    const params = route.method === method ? matchPath(route.path, path) : null;
    if (params) return { handler: route.handler, params };
  }
  return null;
}

function readBearerToken(config: InternalAxiosRequestConfig): string | null {
  const header = config.headers.Authorization;
  if (typeof header !== 'string' || !header.startsWith(BEARER_PREFIX)) return null;
  return header.slice(BEARER_PREFIX.length);
}

async function resolveUserId(token: string | null): Promise<string | null> {
  if (!token) return null;
  const session = (await readCollection('sessions')).find((item) => item.token === token);
  return session?.userId ?? null;
}

function parseBody(data: unknown): unknown {
  if (typeof data !== 'string') return data;
  if (data === '') return undefined;
  try {
    return JSON.parse(data);
  } catch {
    throw new MockHttpError(400, 'Data yang dikirim tidak valid.');
  }
}

function buildSuccess(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  return { data, status, statusText: 'OK', headers: {}, config, request: {} };
}

function buildFailure(config: InternalAxiosRequestConfig, error: MockHttpError): AxiosError {
  const response: AxiosResponse = {
    data: { message: error.message },
    status: error.status,
    statusText: error.message,
    headers: {},
    config,
    request: {},
  };
  const code = error.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
  return new AxiosError(error.message, code, config, undefined, response);
}

// Acts as a stand-in backend: Axios calls this instead of the network, so the
// app's HTTP layer (headers, JSON, status codes) behaves like a real API.
export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  await wait(MOCK_LATENCY_MS);
  const method = (config.method ?? 'get').toUpperCase();
  const path = config.url ?? '';

  try {
    const match = findRoute(method, path);
    if (!match) throw new MockHttpError(404, 'Alamat permintaan tidak ditemukan.');

    const token = readBearerToken(config);
    const request: MockRequest = {
      params: match.params,
      query: (config.params ?? {}) as Record<string, unknown>,
      body: parseBody(config.data),
      token,
      userId: await resolveUserId(token),
    };
    const result = await match.handler(request);
    return buildSuccess(config, result.status, result.data);
  } catch (error) {
    if (error instanceof MockHttpError) throw buildFailure(config, error);
    throw error;
  }
}
