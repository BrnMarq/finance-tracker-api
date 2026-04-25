import { Request, Response } from 'express';
import prisma from '../client';

export class AccountController {
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const account = await prisma.account.create({
        data: { name }
      });
      res.status(201).json(account);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
      try {
        const accounts = await prisma.account.findMany();
        res.json(accounts);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
  }
}
