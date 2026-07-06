import { RequestIdMiddleware, REQUEST_ID_HEADER } from '../src/common/request-id.middleware';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockNext = jest.fn();
  });

  function createMockReq(existingId?: string) {
    const headers: Record<string, string> = {};
    if (existingId) {
      headers[REQUEST_ID_HEADER.toLowerCase()] = existingId;
    }
    return { headers, url: '/test' } as any;
  }

  function createMockRes() {
    return { setHeader: jest.fn() } as any;
  }

  it('should generate a request ID when none is provided', () => {
    const req = createMockReq();
    const res = createMockRes();

    middleware.use(req, res, mockNext);

    expect(req.requestId).toBeDefined();
    expect(typeof req.requestId).toBe('string');
    expect(req.requestId.length).toBeGreaterThan(0);

    expect(res.setHeader).toHaveBeenCalledWith(
      REQUEST_ID_HEADER,
      req.requestId,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should preserve an existing X-Request-Id header', () => {
    const existingId = '550e8400-e29b-41d4-a716-446655440000';
    const req = createMockReq(existingId);
    const res = createMockRes();

    middleware.use(req, res, mockNext);

    expect(req.requestId).toBe(existingId);
    expect(res.setHeader).toHaveBeenCalledWith(
      REQUEST_ID_HEADER,
      existingId,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should generate unique IDs for different requests', () => {
    const ids: string[] = [];

    for (let i = 0; i < 10; i++) {
      const req = createMockReq();
      const res = createMockRes();
      middleware.use(req, res, mockNext);
      ids.push(req.requestId);
    }

    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });
});
