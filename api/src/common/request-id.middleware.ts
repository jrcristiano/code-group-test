import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

export const REQUEST_ID_HEADER = 'X-Request-Id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existingId = req.headers[REQUEST_ID_HEADER.toLowerCase()] as string | undefined;
    const requestId = existingId || crypto.randomUUID();

    // Attach to request object for downstream access
    (req as any).requestId = requestId;

    // Echo back in response so the client can correlate
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}
