import prisma from '../client';

export class ContextService {
  /**
   * Mock AI processing.
   * Simulates a delay and then generates text context based on the media type.
   */
  async processMedia(mediaId: number, transactionId: number) {
    console.log(`[ContextService] Starting processing for Media #${mediaId}...`);

    // Simulate AI Latency synchronously for Vercel
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const media = await prisma.transactionMedia.findUnique({ where: { id: mediaId } });
      if (!media) return;

      let generatedContext = "";
      let generatedItems: { name: string; quantity: number; unitPrice: number; totalPrice: number }[] = [];
      let generatedAmount = 0;
      
      if (media.type === 'AUDIO') {
        generatedContext = "[AI Audio Transcript]: Bought 3 onions, a coffee and a cookie.";
        generatedItems = [
          { name: "Onion", quantity: 3, unitPrice: 0.50, totalPrice: 1.50 },
          { name: "Coffee", quantity: 1, unitPrice: 3.00, totalPrice: 3.00 },
          { name: "Cookie", quantity: 1, unitPrice: 1.50, totalPrice: 1.50 }
        ];
        generatedAmount = 6.00;
      } else if (media.type === 'IMAGE') {
        generatedContext = "[AI Image Analysis]: Extracted text from receipt: 'Purchase confirmed. Amount: $500.00'";
        generatedItems = [
          { name: "Receipt Item", quantity: 1, unitPrice: 500.00, totalPrice: 500.00 }
        ];
        generatedAmount = 500.00;
      } else {
        generatedContext = "[AI Analysis]: Processed attached file.";
      }

      console.log(`[ContextService] Context generated: "${generatedContext}"`);

      // Update the Transaction
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          context: generatedContext,
          totalValue: generatedAmount > 0 ? generatedAmount : undefined,
          status: "COMPLETED",
          items: generatedItems.length > 0 ? {
            create: generatedItems
          } : undefined
        }
      });

      console.log(`[ContextService] Transaction #${transactionId} updated successfully.`);

    } catch (error) {
      console.error(`[ContextService] Error processing media #${mediaId}:`, error);
    }
  }

  async createTransactionFromMedia(accountId: number, fileUrl: string, fileType: string, defaultSymbol: string = "USD") {
    console.log(`[ContextService] Starting processing for new media...`);

    // Simulate AI Latency synchronously for Vercel
    await new Promise(resolve => setTimeout(resolve, 2000));

    let generatedContext = "";
    let generatedItems: { name: string; quantity: number; unitPrice: number; totalPrice: number }[] = [];
    let generatedAmount = 0;
    let inferredType = "EXPENSE";
    let inferredSymbol = defaultSymbol;
    
    if (fileType === 'AUDIO') {
      generatedContext = "[AI Audio Transcript]: Bought 3 onions, a coffee and a cookie.";
      generatedItems = [
        { name: "Onion", quantity: 3, unitPrice: 0.50, totalPrice: 1.50 },
        { name: "Coffee", quantity: 1, unitPrice: 3.00, totalPrice: 3.00 },
        { name: "Cookie", quantity: 1, unitPrice: 1.50, totalPrice: 1.50 }
      ];
      generatedAmount = 6.00;
      inferredType = "EXPENSE";
    } else if (fileType === 'IMAGE') {
      generatedContext = "[AI Image Analysis]: Extracted text from receipt: 'Purchase confirmed. Amount: $500.00'";
      generatedItems = [
        { name: "Receipt Item", quantity: 1, unitPrice: 500.00, totalPrice: 500.00 }
      ];
      generatedAmount = 500.00;
      inferredType = "EXPENSE";
    } else {
      generatedContext = "[AI Analysis]: Processed attached file.";
    }

    console.log(`[ContextService] Context generated: "${generatedContext}"`);

    // Create the Transaction with Media and Items all at once
    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        symbol: inferredSymbol,
        totalValue: generatedAmount > 0 ? generatedAmount : 0,
        type: inferredType,
        context: generatedContext,
        status: "COMPLETED",
        source: "MANUAL",
        items: generatedItems.length > 0 ? {
          create: generatedItems
        } : undefined,
        media: {
          create: {
            url: fileUrl,
            type: fileType
          }
        }
      },
      include: {
        items: true,
        media: true
      }
    });

    console.log(`[ContextService] Transaction created successfully with ID #${transaction.id}.`);
    return transaction;
  }
}
