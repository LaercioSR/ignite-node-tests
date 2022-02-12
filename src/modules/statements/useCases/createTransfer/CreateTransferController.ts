import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { receiver_id } = request.params;
    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateTransferUseCase);

    const statement = await createStatement.execute({
      user_id,
      receiver_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
