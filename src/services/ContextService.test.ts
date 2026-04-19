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
        context: "[AI Audio Transcript]: 'I bought 0.5 BTC because the resistance level at 40k was broken.'",
        status: "COMPLETED"
      }
    });
  });
});
