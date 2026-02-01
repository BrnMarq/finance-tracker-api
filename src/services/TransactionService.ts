import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTransactionDTO {
  accountId: number;
  symbol: string;
  amount: number;
  price: number;
  type: string;
  context: string;
}

export class TransactionService {
  async createTransaction(data: CreateTransactionDTO) {
    return prisma.transaction.create({
      data: {
        accountId: data.accountId,
        symbol: data.symbol,
        amount: data.amount,
        price: data.price,
        type: data.type,
        context: data.context
      }
    });
  }

  async getAccountTransactions(accountId: number) {
    return prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' }
    });
  }
}
