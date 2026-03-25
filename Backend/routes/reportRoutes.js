import { Router } from "express";
import { getAllReports, createReport, updateReportStatus, addReply } from "../controllers/reportController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, admin, getAllReports);
router.post("/", protect, createReport);
router.put("/:id/status", protect, admin, updateReportStatus);
router.post("/:id/reply", protect, admin, addReply);

export default router;
