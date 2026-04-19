import prisma from '../client';

export class ContextService {
  /**
   * Mock AI processing.
   * Simulates a delay and then generates text context based on the media type.
   */
  async processMedia(mediaId: number, transactionId: number) {
    console.log(`[ContextService] Starting async processing for Media #${mediaId}...`);

    // Simulate AI Latency (2 seconds)
    setTimeout(async () => {
      try {
        const media = await prisma.transactionMedia.findUnique({ where: { id: mediaId } });
        if (!media) return;

        let generatedContext = "";
        
        if (media.type === 'AUDIO') {
          generatedContext = "[AI Audio Transcript]: 'I bought 0.5 BTC because the resistance level at 40k was broken.'";
        } else if (media.type === 'IMAGE') {
          generatedContext = "[AI Image Analysis]: Extracted text from receipt: 'Purchase confirmed. Amount: $500.00'";
        } else {
          generatedContext = "[AI Analysis]: Processed attached file.";
        }

        console.log(`[ContextService] Context generated: "${generatedContext}"`);

        // Update the Transaction
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            context: generatedContext,
            status: "COMPLETED"
          }
        });

        console.log(`[ContextService] Transaction #${transactionId} updated successfully.`);

      } catch (error) {
        console.error(`[ContextService] Error processing media #${mediaId}:`, error);
      }
    }, 2000); // 2 second mock delay
  }
}
