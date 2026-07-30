import { apiPost } from "./client.js";

export async function sendChatMessage({ conversationId, userQuery }) {
  return apiPost("/chat", { conversation_id: conversationId, user_query: userQuery });
}
