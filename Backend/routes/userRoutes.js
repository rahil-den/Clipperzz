import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.post("/api/users", protect, admin, createUser);
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
