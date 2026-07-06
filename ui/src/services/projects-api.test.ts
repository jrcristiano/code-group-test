import { describe, expect, it } from 'vitest';
import { parsePaginatedProjects } from './projects-api';

describe('parsePaginatedProjects', () => {
  it('accepts the server-side pagination contract', () => {
    const payload = {
      items: [],
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 0,
      nextPage: false,
      summary: {
        totalProjects: 0,
        inReview: 0,
        inExecution: 0,
        listedBudget: 0,
        highRisk: 0,
      },
    };

    expect(parsePaginatedProjects(payload)).toBe(payload);
  });

  it('reports a stale API contract instead of returning undefined items', () => {
    expect(() => parsePaginatedProjects({
      data: [],
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 0,
    })).toThrow('A API está usando o contrato antigo');
  });
});
