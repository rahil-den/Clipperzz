import { Router } from "express";
import { getAllJobs, getMyJobs, deleteJob, updateJobStatus } from "../controllers/jobController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, admin, getAllJobs);
router.get("/me", protect, getMyJobs);
router.delete("/:id", protect, admin, deleteJob);
router.put("/:id", protect, admin, updateJobStatus);

export default router;
