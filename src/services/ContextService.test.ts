import { ContextService } from './ContextService';
import { prismaMock } from '../singleton';
import prisma from '../client';

describe('ContextService', () => {
  let contextService: ContextService;

  beforeEach(() => {
    contextService = new ContextService();
    jest.useFakeTimers(); // Mock timers because the service uses setTimeout
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should process AUDIO media and update transaction', async () => {
    // Arrange
    const mediaId = 1;
    const transactionId = 100;
    
    // Setup mock return for findUnique
    prismaMock.transactionMedia.findUnique.mockResolvedValue({
      id: mediaId,
      url: '/uploads/test.mp3',
      type: 'AUDIO',
      transactionId: transactionId,
      createdAt: new Date()
    });

    prismaMock.transaction.update.mockResolvedValue({} as any);

    // Act
    const promise = contextService.processMedia(mediaId, transactionId);
    
    // Fast-forward timers
    jest.advanceTimersByTime(2000);
    
    await promise; // Wait for any lingering promises

    // Assert
    expect(prismaMock.transactionMedia.findUnique).toHaveBeenCalledWith({ where: { id: mediaId } });
    expect(prismaMock.transaction.update).toHaveBeenCalledWith({
      where: { id: transactionId },
      data: {
        context: "[AI Audio Transcript]: Bought 3 onions, a coffee and a cookie.",
        totalValue: 6,
        status: "COMPLETED",
        items: {
          create: [
            { name: "Onion", quantity: 3, unitPrice: 0.50, totalPrice: 1.50 },
            { name: "Coffee", quantity: 1, unitPrice: 3.00, totalPrice: 3.00 },
            { name: "Cookie", quantity: 1, unitPrice: 1.50, totalPrice: 1.50 }
          ]
        }
      }
    });
  });
});
