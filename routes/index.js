import express from "express";
import { refreshToken } from "../controllers/refreshToken.js";
import * as usersController from "../controllers/usersController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/v1/users", verifyToken, usersController.getUsers);
router.get("/v1/users/:id", verifyToken, usersController.getUser);
router.post("/v1/register", usersController.register);
router.post("/v1/login", usersController.login);
router.delete("/v1/logout", usersController.logout);
router.get("/v1/token", refreshToken);

export default router;