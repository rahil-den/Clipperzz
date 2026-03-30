import { Router } from "express";
import {
    getMyUsage,
    getAllUsage,
    updateUsage,
    resetUsage,
} from "../controllers/usageController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/me",         protect,        getMyUsage);    // GET  /api/usage/me
router.get("/",           protect, admin, getAllUsage);   // GET  /api/usage          (admin)
router.put("/:id",        protect, admin, updateUsage);  // PUT  /api/usage/:id      (admin)
router.post("/:id/reset", protect, admin, resetUsage);   // POST /api/usage/:id/reset (admin)

export default router;
