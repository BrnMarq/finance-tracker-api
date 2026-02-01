import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";

const router = Router();
const controller = new TransactionController();

router.post("/", controller.create);
router.get("/account/:id", controller.getByAccount);

export default router;
