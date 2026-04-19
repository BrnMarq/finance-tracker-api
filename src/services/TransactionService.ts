import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTransactionDTO {
  accountId: number;
  symbol: string;
  amount: number;
  price: number;
  type: string;
  context?: string; // Made Optional
  source?: string;  // Optional (Default MANUAL)
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
        context: data.context || null,
        status: data.context ? "COMPLETED" : "PENDING_CONTEXT",
        source: data.source || "MANUAL"
      }
    });
  }

  async getAccountTransactions(accountId: number) {
    return prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
      include: { media: true } // Include media in results
    });
  }

  // New method to handle media attachment
  async addMedia(transactionId: number, fileUrl: string, fileType: string) {
    return prisma.transactionMedia.create({
      data: {
        transactionId,
        url: fileUrl,
        type: fileType
      }
    });
  }
}
