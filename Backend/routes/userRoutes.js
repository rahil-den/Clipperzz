import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/userController.js";



const router = Router();



router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
