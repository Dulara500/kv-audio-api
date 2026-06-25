import { StreamChat } from "stream-chat";
import User from "../models/user.js";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

/**
 * Generate a Stream Chat token for the authenticated user.
 * - Upserts the user in Stream Chat
 * - For customers: creates a support channel and adds the admin
 * - Returns { token, userId, channelId? }
 */
export async function getStreamToken(req) {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // Build a Stream-safe user ID from the MongoDB _id
    const userId = req.user.id.toString().replace(/[^a-zA-Z0-9_\-@]/g, "_");
    const userName = req.user.name || req.user.email;
    const userRole = req.user.role;

    // Upsert user in Stream Chat
    await serverClient.upsertUser({
        id: userId,
        name: userName,
        role: userRole === "admin" ? "admin" : "user",
        email: req.user.email,
    });

    // Generate token
    const token = serverClient.createToken(userId);

    // For customer users: create/get the support channel and add admin
    let channelId = null;
    if (userRole !== "admin") {
        channelId = `support-${userId}`;

        // Find the admin user in MongoDB
        const adminUser = await User.findOne({ role: "admin" });
        if (adminUser) {
            const adminStreamId = adminUser._id
                .toString()
                .replace(/[^a-zA-Z0-9_\-@]/g, "_");

            // Upsert admin in Stream as well
            await serverClient.upsertUser({
                id: adminStreamId,
                name: `${adminUser.firstName} ${adminUser.lastName}`,
                role: "admin",
                email: adminUser.email,
            });

            // Create or get the channel
            const channel = serverClient.channel("messaging", channelId, {
                name: `Support — ${userName}`,
                created_by_id: userId,
                members: [userId, adminStreamId],
            });
            await channel.create();

            // Ensure admin is a member even if the channel already existed
            await channel.addMembers([adminStreamId, userId]);
        }
    }

    return { token, userId, channelId };
}