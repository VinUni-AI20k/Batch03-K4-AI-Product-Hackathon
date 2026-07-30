import { apiGet, apiPatch, apiPost } from "./client.js";

export const TIMELINE_KEY = "/timeline";

export async function getTimeline() {
  const data = await apiGet(TIMELINE_KEY);
  return data.items;
}

export async function patchTimelineItem(itemId, patch) {
  return apiPatch(`/timeline/${itemId}`, patch);
}

export async function flagTimelineItem(itemId, note) {
  return apiPost(`/timeline/${itemId}/feedback`, { feedback_type: "incorrect", note });
}

export async function confirmCalendar(itemId) {
  return apiPost(`/timeline/${itemId}/calendar`, {});
}
