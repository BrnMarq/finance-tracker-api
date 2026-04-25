import { Router } from 'express';
import accountRoutes from './accountRoutes';
import transactionRoutes from './transactionRoutes';
import priceRoutes from './priceRoutes';
import cronRoutes from './cron/cronRoutes';

const router = Router();

router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/prices', priceRoutes);
router.use('/cron', cronRoutes);

export default router;
