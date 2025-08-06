import express from "express";
import {
  sendMessage,
  getInbox,
  getMessageById,
  getConversationBetweenUsers // ✅ novo
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ correto

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/", verifyToken, getInbox);

// ✅ a rota específica vem ANTES da rota dinâmica
router.get("/conversation/:userId", verifyToken, getConversationBetweenUsers);
router.get("/:id", verifyToken, getMessageById);

export default router;
