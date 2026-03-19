import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = Router();

router.use(protect, authorize("admin", "superadmin"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
