import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';

const transactionService = new TransactionService();

export class TransactionController {
  async create(req: Request, res: Response) {
    try {
      const { accountId, symbol, amount, price, type, context } = req.body;
      const transaction = await transactionService.createTransaction({
        accountId, symbol, amount, price, type, context
      });
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByAccount(req: Request, res: Response) {
    try {
      const accountId = parseInt(req.params.id as string);
      const transactions = await transactionService.getAccountTransactions(accountId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
