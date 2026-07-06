import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidStatusTransitionException extends HttpException {
  constructor(from: string, to: string) {
    super(
      `Transição de status inválida: não é permitido mudar de "${from}" para "${to}".`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class ProjectDeletionBlockedException extends HttpException {
  constructor(status: string) {
    super(
      `Não é permitido excluir projeto com status "${status}". Apenas projetos que não estejam em andamento ou encerrados podem ser excluídos.`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class InvalidDateRangeException extends HttpException {
  constructor() {
    super(
      'A data de término deve ser posterior à data de início.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidProjectDateException extends HttpException {
  constructor(field: 'startDate' | 'endDate') {
    super(
      `${field} deve ser uma data válida no formato YYYY-MM-DD.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ProjectNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Projeto com ID "${id}" não encontrado.`, HttpStatus.NOT_FOUND);
  }
}
