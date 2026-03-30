import { Router } from "express";
import {
    getAllJobs,
    getMyJobs,
    createJob,
    getJobById,
    updateJobStatus,
    deleteJob,
} from "../controllers/jobController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/",       protect, admin, getAllJobs);      // GET    /api/jobs      (admin)
router.get("/me",     protect,        getMyJobs);       // GET    /api/jobs/me
router.post("/",      protect,        createJob);       // POST   /api/jobs
router.get("/:id",    protect,        getJobById);      // GET    /api/jobs/:id
router.put("/:id",    protect, admin, updateJobStatus); // PUT    /api/jobs/:id  (admin)
router.delete("/:id", protect, admin, deleteJob);       // DELETE /api/jobs/:id  (admin)

export default router;
