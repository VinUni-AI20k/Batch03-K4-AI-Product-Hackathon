import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { initialMessages, initialPlatforms } from "./data.js";
import { ApiError } from "./api/client.js";
import { sendChatMessage } from "./api/chat.js";
import { TIMELINE_KEY, confirmCalendar, flagTimelineItem, getTimeline, patchTimelineItem } from "./api/timeline.js";
import { disconnectDiscord, disconnectGoogle, getConnections, getDiscordInviteUrl, getGoogleAuthUrl } from "./api/connections.js";
import { formatTime } from "./utils/formatters.js";
import { QUICK_ACTION_QUERIES } from "./constants/chat.js";
import { Icon } from "./components/common/Icon.jsx";
import { Toast } from "./components/common/Toast.jsx";
import { Header } from "./components/layout/Header.jsx";
import { ChatPanel } from "./components/chat/ChatPanel.jsx";
import { Dashboard } from "./components/dashboard/Dashboard.jsx";
import { EditDialog } from "./components/dashboard/EditDialog.jsx";

export default function App() {
  const [conversationId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState(initialMessages);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [activeAction, setActiveAction] = useState("week");
  const [showConnections, setShowConnections] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileView, setMobileView] = useState("dashboard");
  const [seededActions, setSeededActions] = useState(() => new Set());
  const [busyItemId, setBusyItemId] = useState(null);

  const {
    data: events = [],
    error: timelineError,
    isLoading: timelineLoading,
    mutate: mutateTimeline,
  } = useSWR(TIMELINE_KEY, getTimeline);

  const { trigger: triggerChat, isMutating: isSending } = useSWRMutation("studypulse-chat", (_key, { arg }) => sendChatMessage(arg));

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };

  const refreshConnections = async () => {
    try {
      const data = await getConnections();
      setPlatforms((current) =>
        current.map((platform) => {
          if (platform.id === "gmail") return { ...platform, connected: data.google.connected };
          if (platform.id === "discord") return { ...platform, connected: data.discord.connected, guilds: data.discord.guilds };
          return platform;
        }),
      );
    } catch {
      // Backend may be offline; leave platforms as-is (mock state).
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get("google_connected");
    if (googleConnected !== null) {
      notify(googleConnected === "1" ? "Đã kết nối Gmail & Google Calendar" : "Kết nối Gmail thất bại, thử lại sau.");
      params.delete("google_connected");
      params.delete("reason");
      const query = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (query ? `?${query}` : ""));
    }
    refreshConnections();
  }, []);

  useEffect(() => {
    // Re-check whenever the panel is opened — connecting Gmail (full-page
    // redirect) or Discord (opened in a new tab, no callback to us) both
    // happen outside this app, so the one-time fetch on initial load goes
    // stale as soon as either completes.
    if (showConnections) refreshConnections();
  }, [showConnections]);

  const sendMessage = async (text) => {
    const userMessageId = crypto.randomUUID();
    const loadingMessageId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: "user", text, time: formatTime() },
      { id: loadingMessageId, role: "assistant", text: "", time: "", loading: true },
    ]);

    try {
      const data = await triggerChat({ conversationId, userQuery: text });
      setMessages((current) =>
        current.map((message) =>
          message.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                text: data.response_text,
                time: formatTime(),
                needsClarification: data.requires_clarification,
                calendarEvents: data.calendar_events,
              }
            : message,
        ),
      );
      if (data.timeline_items_referenced?.length) {
        mutateTimeline();
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Không thể kết nối tới StudyPulse.";
      setMessages((current) =>
        current.map((existing) =>
          existing.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                text: `${message} Kiểm tra backend đã chạy chưa rồi thử lại.`,
                time: formatTime(),
                isError: true,
                retryText: text,
              }
            : existing,
        ),
      );
    }
  };

  const handleAction = (id) => {
    setActiveAction(id);
    setShowConnections(false);
    if (!seededActions.has(id) && QUICK_ACTION_QUERIES[id]) {
      setSeededActions((current) => new Set(current).add(id));
      sendMessage(QUICK_ACTION_QUERIES[id]);
    }
  };

  const togglePlatform = async (id) => {
    if (id === "gmail") {
      const gmail = platforms.find((platform) => platform.id === "gmail");
      if (gmail?.connected) {
        const confirmed = window.confirm(
          "Hủy kết nối Gmail & Google Calendar?\n\nStudyPulse sẽ không thể đọc email hoặc lịch của bạn cho đến khi bạn kết nối lại.",
        );
        if (!confirmed) return;
        try {
          await disconnectGoogle();
          setPlatforms((current) => current.map((platform) => (platform.id === "gmail" ? { ...platform, connected: false } : platform)));
          notify("Đã hủy kết nối Gmail & Google Calendar");
        } catch (err) {
          notify(err instanceof ApiError ? err.message : "Không thể hủy kết nối, thử lại sau.");
        }
        return;
      }
      try {
        const authUrl = await getGoogleAuthUrl();
        window.location.href = authUrl;
      } catch (err) {
        notify(err instanceof ApiError ? err.message : "Không thể bắt đầu kết nối Gmail, kiểm tra backend.");
      }
      return;
    }

    if (id === "discord") {
      // Bots can be in several servers at once, so the row's main button
      // always opens the invite flow (to add another one) — disconnecting a
      // specific server happens per-row in the guild list below, not here.
      try {
        const inviteUrl = await getDiscordInviteUrl();
        window.open(inviteUrl, "_blank", "noopener,noreferrer");
        notify("Cần quản trị viên server đồng ý mời bot. Sau khi mời xong, mở lại Quản lý kết nối để kiểm tra.");
      } catch (err) {
        notify(err instanceof ApiError ? err.message : "Không thể lấy link mời bot, kiểm tra backend.");
      }
      return;
    }

    setPlatforms((current) => current.map((platform) => (platform.id === id ? { ...platform, connected: true } : platform)));
    notify("Đã kết nối nền tảng thành công");
  };

  const disconnectDiscordGuild = async (guildId, guildName) => {
    const confirmed = window.confirm(
      `Hủy kết nối server Discord "${guildName}"?\n\nBot sẽ rời khỏi server này và StudyPulse sẽ không thể đọc tin nhắn ở đó nữa cho đến khi được mời lại.`,
    );
    if (!confirmed) return;
    try {
      await disconnectDiscord(guildId);
      setPlatforms((current) =>
        current.map((platform) => {
          if (platform.id !== "discord") return platform;
          const guilds = (platform.guilds || []).filter((guild) => guild.id !== guildId);
          return { ...platform, guilds, connected: guilds.length > 0 };
        }),
      );
      notify(`Đã hủy kết nối server "${guildName}"`);
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể hủy kết nối, thử lại sau.");
    }
  };

  const flagEvent = async (id) => {
    setBusyItemId(id);
    try {
      await flagTimelineItem(id);
      await mutateTimeline();
      notify("Đã đánh dấu sai và chuyển cho TA kiểm tra");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể đánh dấu mục này, thử lại sau.");
    } finally {
      setBusyItemId(null);
    }
  };

  const addToCalendar = async (id) => {
    setBusyItemId(id);
    try {
      const result = await confirmCalendar(id);
      notify(result.detail ? `Đã thêm vào Google Calendar: ${result.detail}` : "Đã thêm sự kiện vào Google Calendar");
      await mutateTimeline();
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể thêm vào lịch, thử lại sau.");
    } finally {
      setBusyItemId(null);
    }
  };

  const saveEvent = async (id, time) => {
    try {
      await patchTimelineItem(id, { time });
      await mutateTimeline();
      setEditingEvent(null);
      notify("Đã lưu thay đổi của bạn");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể lưu thay đổi, thử lại sau.");
    }
  };

  const dashboardProps = {
    events,
    timelineLoading,
    timelineError,
    onRetryTimeline: () => mutateTimeline(),
    busyItemId,
    platforms,
    activeAction,
    onAction: handleAction,
    onCalendar: addToCalendar,
    onEdit: setEditingEvent,
    onFlag: flagEvent,
    onTogglePlatform: togglePlatform,
    onDisconnectGuild: disconnectDiscordGuild,
    showConnections,
    setShowConnections,
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
      <Header onOpenConnections={() => { setShowConnections(true); setMobileView("dashboard"); }} />
      <div className="hidden min-h-0 flex-1 lg:flex">
        <ChatPanel messages={messages} onSend={sendMessage} isSending={isSending} />
        <Dashboard {...dashboardProps} />
      </div>
      <div className="min-h-0 flex-1 lg:hidden">
        {mobileView === "chat" ? (
          <ChatPanel messages={messages} onSend={sendMessage} isSending={isSending} />
        ) : (
          <Dashboard {...dashboardProps} />
        )}
      </div>
      <nav className="grid h-16 shrink-0 grid-cols-2 border-t border-slate-200 bg-white lg:hidden" aria-label="Điều hướng di động">
        <button onClick={() => setMobileView("dashboard")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "dashboard" ? "text-blue-600" : "text-slate-400"}`}><Icon>dashboard</Icon>Tổng quan</button>
        <button onClick={() => setMobileView("chat")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "chat" ? "text-blue-600" : "text-slate-400"}`}><Icon>smart_toy</Icon>Trợ lý AI</button>
      </nav>
      <EditDialog event={editingEvent} onClose={() => setEditingEvent(null)} onSave={saveEvent} />
      {toast ? <Toast text={toast} /> : null}
    </main>
  );
}
