import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { upload } from "../config/multer";

const router = Router();
const controller = new TransactionController();

router.post("/", controller.create);
router.get("/account/:id", controller.getByAccount);

// New endpoint for media context
router.post("/:id/context", upload.single('file'), controller.addContextMedia);

export default router;
