import express from "express";
import {
  sendMessage,
  getInbox,
  getMessageById,
  getConversationBetweenUsers,
  getRoomHistory,
} from "../controllers/messageController.js";
import { requireAuth } from "../middleware/authMiddleware.js"; // ✅ Sessão

const router = express.Router();

// ✅ Usar requireAuth em todas as rotas protegidas
router.post("/", requireAuth, sendMessage);
router.get("/", requireAuth, getInbox);
router.get("/conversation/:userId", requireAuth, getConversationBetweenUsers);
router.get("/history/:roomId", requireAuth, getRoomHistory);
router.get("/:id", requireAuth, getMessageById);

export default router;

