import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from '../src/common/http-exception.filter';
import { REQUEST_ID_HEADER } from '../src/common/request-id.middleware';
import {
  ProjectNotFoundException,
  InvalidStatusTransitionException,
  InvalidDateRangeException,
} from '../src/common/business-exceptions';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    // Suppress Logger output during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

    filter = new AllExceptionsFilter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createMockContext(requestId?: string) {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockResponse = { status: mockStatus };
    const headers: Record<string, string> = {};
    if (requestId) {
      headers[REQUEST_ID_HEADER.toLowerCase()] = requestId;
    }
    const mockRequest = {
      headers,
      url: '/projects/123',
      method: 'GET',
    };
    return {
      mockJson,
      mockStatus,
      mockHost: {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost,
    };
  }

  // --- 5xx errors: must not leak internal details ---

  it('should return safe 500 message for unknown (non-HttpException) errors', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch(new Error('Sensitive DB error: connection refused'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(500);
    const body = mockJson.mock.calls[0][0];

    expect(body.statusCode).toBe(500);
    expect(body.message).toBe('Erro interno do servidor');
    expect(body.timestamp).toEqual(expect.any(String));
    expect(body.requestId).toBe('test-id');

    // Must NOT leak internal details
    expect(body.message).not.toContain('Sensitive');
    expect(body.message).not.toContain('connection refused');
  });

  it('should return safe 500 message for HttpException with status 500', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch(
      new HttpException(
        'Internal crash details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
      mockHost,
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    const body = mockJson.mock.calls[0][0];
    expect(body.message).toBe('Erro interno do servidor');
  });

  it('should return generic 500 message for non-Error exceptions', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch('some string exception', mockHost);

    expect(mockStatus).toHaveBeenCalledWith(500);
    const body = mockJson.mock.calls[0][0];
    expect(body.message).toBe('Erro interno do servidor');
  });

  // --- 4xx errors: safe to expose business messages ---

  it('should return 404 message from ProjectNotFoundException', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch(new ProjectNotFoundException('abc-123'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(404);
    const body = mockJson.mock.calls[0][0];
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain('não encontrado');
    expect(body.message).toContain('abc-123');
    expect(body.requestId).toBe('test-id');
  });

  it('should return 422 for invalid status transitions', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch(
      new InvalidStatusTransitionException('IN_REVIEW', 'FINISHED'),
      mockHost,
    );

    expect(mockStatus).toHaveBeenCalledWith(422);
    const body = mockJson.mock.calls[0][0];
    expect(body.statusCode).toBe(422);
    expect(body.message).toContain('Transição');
    expect(body.message).toContain('IN_REVIEW');
    expect(body.message).toContain('FINISHED');
  });

  it('should return 400 for invalid date range', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    filter.catch(new InvalidDateRangeException(), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(400);
    const body = mockJson.mock.calls[0][0];
    expect(body.statusCode).toBe(400);
    expect(body.message).toContain('data de término');
  });

  // --- Validation error handling ---

  it('should join validation error messages from array', () => {
    const { mockJson, mockStatus, mockHost } = createMockContext('test-id');

    const validationException = new HttpException(
      {
        message: ['name should not be empty', 'totalBudget must be positive'],
        error: 'Bad Request',
        statusCode: 400,
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(validationException, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(400);
    const body = mockJson.mock.calls[0][0];
    expect(body.message).toBe(
      'name should not be empty; totalBudget must be positive',
    );
  });

  // --- RequestId fallback ---

  it('should use "unknown" when requestId header is absent', () => {
    const { mockJson, mockHost } = createMockContext(); // no requestId

    filter.catch(new Error('test'), mockHost);

    const body = mockJson.mock.calls[0][0];
    expect(body.requestId).toBe('unknown');
  });

  // --- Timestamp presence ---

  it('should include an ISO 8601 timestamp in every response', () => {
    const { mockJson, mockHost } = createMockContext('test-id');

    filter.catch(new Error('test'), mockHost);

    const body = mockJson.mock.calls[0][0];
    expect(body.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
    );
  });
});
