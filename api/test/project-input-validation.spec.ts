import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProjectDto } from '../src/modules/projects/dto/create-project.dto';
import { UpdateProjectDto } from '../src/modules/projects/dto/update-project.dto';

const validProject = {
  name: 'Projeto válido',
  startDate: '2026-01-01',
  endDate: '2026-04-01',
  totalBudget: 100000,
  description: 'Descrição válida',
};

describe('Project input validation', () => {
  it.each(['2026-02-30', '2026-01-01T00:00:00.000Z', '01/01/2026'])(
    'rejects invalid date input %s',
    async (startDate) => {
      const dto = plainToInstance(CreateProjectDto, {
        ...validProject,
        startDate,
      });
      const errors = await validate(dto);

      expect(errors.some((error) => error.property === 'startDate')).toBe(true);
    },
  );

  it('trims valid text before validation and persistence', async () => {
    const dto = plainToInstance(CreateProjectDto, {
      ...validProject,
      name: '  Projeto válido  ',
      description: '  Descrição válida  ',
    });

    expect(await validate(dto)).toHaveLength(0);
    expect(dto.name).toBe('Projeto válido');
    expect(dto.description).toBe('Descrição válida');
  });

  it.each(['name', 'description'] as const)(
    'rejects whitespace-only %s',
    async (field) => {
      const dto = plainToInstance(CreateProjectDto, {
        ...validProject,
        [field]: '   ',
      });
      const errors = await validate(dto);

      expect(errors.some((error) => error.property === field)).toBe(true);
    },
  );

  it('keeps partial updates valid', async () => {
    const dto = plainToInstance(UpdateProjectDto, { name: '  Novo nome  ' });

    expect(await validate(dto)).toHaveLength(0);
    expect(dto.name).toBe('Novo nome');
    expect(dto.description).toBeUndefined();
  });

  it('returns 400 for a malformed project id', async () => {
    const pipe = new ParseUUIDPipe({ version: '4' });

    await expect(
      pipe.transform('not-a-uuid', { type: 'param', metatype: String }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts a valid UUID v4 project id', async () => {
    const pipe = new ParseUUIDPipe({ version: '4' });
    const id = '66c587e9-55cd-4891-b509-fa00cd29e275';

    await expect(
      pipe.transform(id, { type: 'param', metatype: String }),
    ).resolves.toBe(id);
  });
});
