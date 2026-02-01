import { Router } from 'express';
import accountRoutes from './accountRoutes';
import transactionRoutes from './transactionRoutes';
import priceRoutes from './priceRoutes';

const router = Router();

router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/prices', priceRoutes);

export default router;
