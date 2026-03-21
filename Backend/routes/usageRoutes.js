import { Router } from "express";
import { getMyUsage, updateUsage, getAllUsage } from "../controllers/usageController.js";



const router = Router();

router.get("/me", getMyUsage);
router.get("/", getAllUsage);
router.put("/:id", updateUsage);

export default router;
