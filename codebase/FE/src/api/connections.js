import { apiGet, apiPost } from "./client.js";

export const CONNECTIONS_KEY = "/connections";

export async function getConnections() {
  return apiGet(CONNECTIONS_KEY);
}

export async function getGoogleAuthUrl() {
  const data = await apiGet("/connections/google/start");
  return data.auth_url;
}

export async function disconnectGoogle() {
  return apiPost("/connections/google/disconnect");
}

export async function getDiscordInviteUrl() {
  const data = await apiGet("/connections/discord/start");
  return data.invite_url;
}

export async function disconnectDiscord(guildId) {
  return apiPost("/connections/discord/disconnect", { guild_id: guildId });
}
