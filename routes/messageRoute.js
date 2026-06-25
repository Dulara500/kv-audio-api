import express from "express";
import { getStreamToken } from "../Controllers/messageController.js";
import authentication from "../middleware/authentication.js";

const messageRouter = express.Router();

// POST /api/message/stream-token — Generate a Stream Chat token for the logged-in user
messageRouter.post("/stream-token", authentication, async (req, res) => {
    try {
        const result = await getStreamToken(req);
        res.status(200).json({
            message: "Stream token generated successfully",
            token: result.token,
            userId: result.userId,
            channelId: result.channelId,
        });
    } catch (err) {
        console.error("Stream token error:", err);
        res.status(500).json({
            message: err.message || "Error generating Stream token",
        });
    }
});

export default messageRouter;