import axios, { AxiosError } from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');

const httpClient = axios.create({
  baseURL: configuredApiUrl || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// --- Request interceptor: add correlation ID ---
httpClient.interceptors.request.use((config) => {
  // Use browser-native crypto.randomUUID() — available in all modern browsers
  const requestId =
    (typeof self !== 'undefined' && self.crypto?.randomUUID?.()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  config.headers.set('X-Request-Id', requestId);
  return config;
});

// --- Response interceptor: safe error messages ---
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; requestId?: string }>) => {
    const data = error.response?.data;
    let message = 'Erro inesperado. Tente novamente.';

    if (data?.message) {
      message = Array.isArray(data.message)
        ? data.message.join('; ')
        : data.message;
    }

    // Sanitize: strip any HTML/script tags from error messages
    // Prevents stored XSS if attacker-controlled strings end up in messages
    const sanitized = message.replace(/<[^>]*>/g, '');

    // Attach server's request ID for debugging (non-breaking)
    const requestId = data?.requestId;
    const errorWithId = new Error(sanitized) as Error & { requestId?: string };
    if (requestId) {
      errorWithId.requestId = requestId;
    }

    return Promise.reject(errorWithId);
  },
);

export default httpClient;
