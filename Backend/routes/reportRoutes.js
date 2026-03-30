import { Router } from "express";
import {
    getAllReports,
    getMyReports,
    getReportById,
    createReport,
    updateReportStatus,
    addReply,
    deleteReport,
} from "../controllers/reportController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/",              protect, admin, getAllReports);       // GET    /api/reports          (admin)
router.get("/me",            protect,        getMyReports);        // GET    /api/reports/me
router.post("/",             protect,        createReport);        // POST   /api/reports
router.get("/:id",           protect,        getReportById);       // GET    /api/reports/:id
router.put("/:id/status",    protect, admin, updateReportStatus);  // PUT    /api/reports/:id/status (admin)
router.post("/:id/reply",    protect, admin, addReply);            // POST   /api/reports/:id/reply  (admin)
router.delete("/:id",        protect,        deleteReport);        // DELETE /api/reports/:id

export default router;
