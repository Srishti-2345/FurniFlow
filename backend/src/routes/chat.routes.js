const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  createConversation,
  getMyConversations,
  getMessages,
} = require("../controllers/chat.controller");

router.post(
  "/conversation",
  protect,
  createConversation
);

router.get(
  "/conversations",
  protect,
  getMyConversations
);

router.get(
  "/:id/messages",
  protect,
  getMessages
);

module.exports = router;