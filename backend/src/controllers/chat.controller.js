const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");


// Create Conversation
exports.createConversation = async (req, res) => {
  try {

    const { participantId } = req.body;

    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, participantId],
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
    });

    res.status(201).json({
      success: true,
      conversation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get My Conversations
exports.getMyConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "fullName email profileImage role")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Messages
exports.getMessages = async (req, res) => {
  try {

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (
      !conversation.participants.some(
        (id) => id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      conversation: req.params.id,
    })
      .populate("sender", "fullName")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};