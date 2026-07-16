"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { getSocketUrl } from "@/lib/env/socket";
import { Pencil, Trash2 } from "lucide-react";

interface DmPeer {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  avatarUrl?: string;
}

interface DmConversation {
  id: string;
  peer: DmPeer;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    warnNonFriend?: boolean;
    createdAt: string;
  };
}

interface DmMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  warnNonFriend?: boolean;
  editedAt?: string;
  createdAt: string;
  isOwn?: boolean;
  sender?: DmPeer;
}

export function DashboardMessagesPanel() {
  const searchParams = useSearchParams();
  const targetHandle = searchParams.get("user")?.trim() ?? "";

  const [conversations, setConversations] = useState<DmConversation[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [editDraft, setEditDraft] = useState("");
  const socketRef = useRef<Socket | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((entry) => entry.id === activeId),
    [conversations, activeId],
  );

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/dm/conversations", {
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && Array.isArray(data.conversations)) {
      setConversations(data.conversations as DmConversation[]);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const response = await fetch(
      `/api/dm/conversations/${encodeURIComponent(conversationId)}/messages`,
      { credentials: "include" },
    );
    const data = await response.json().catch(() => ({}));
    if (response.ok && Array.isArray(data.messages)) {
      setMessages(data.messages as DmMessage[]);
    }
  }, []);

  useEffect(() => {
    void loadConversations().finally(() => setLoading(false));
  }, [loadConversations]);

  useEffect(() => {
    if (!targetHandle || conversations.length === 0) return;
    const match = conversations.find((entry) => entry.peer.handle === targetHandle);
    if (match) setActiveId(match.id);
  }, [targetHandle, conversations]);

  useEffect(() => {
    if (!activeId) return;
    void loadMessages(activeId);

    const socket = io(getSocketUrl(), {
      path: "/api/socket/io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("dm:join", { conversationId: activeId });
    });

    socket.on("dm:message", (message: DmMessage) => {
      if (message.conversationId !== activeId) return;
      setMessages((current) => [...current, message]);
      void loadConversations();
    });

    socket.on("dm:edited", (message: DmMessage) => {
      setMessages((current) =>
        current.map((entry) =>
          entry.id === message.id ? { ...entry, ...message } : entry,
        ),
      );
    });

    socket.on("dm:deleted", (payload: { id: string }) => {
      setMessages((current) => current.filter((entry) => entry.id !== payload.id));
    });

    return () => {
      socket.emit("dm:leave", { conversationId: activeId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeId, loadMessages, loadConversations]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;

    setSending(true);
    try {
      if (activeConversation) {
        const response = await fetch("/api/dm/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            recipientHandle: activeConversation.peer.handle,
            content: draft.trim(),
          }),
        });
        if (response.ok) {
          setDraft("");
          const data = await response.json();
          if (data.conversationId && !activeId) {
            setActiveId(data.conversationId);
          }
          await loadConversations();
        }
      } else if (targetHandle) {
        const response = await fetch("/api/dm/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            recipientHandle: targetHandle,
            content: draft.trim(),
          }),
        });
        if (response.ok) {
          setDraft("");
          const data = await response.json();
          if (data.conversationId) setActiveId(data.conversationId);
          await loadConversations();
        }
      }
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(messageId: string) {
    await fetch(`/api/dm/messages/${encodeURIComponent(messageId)}`, {
      method: "DELETE",
      credentials: "include",
    });
    setMessages((current) => current.filter((entry) => entry.id !== messageId));
  }

  async function handleSaveEdit(messageId: string) {
    if (!editDraft.trim()) return;
    const response = await fetch(`/api/dm/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: editDraft.trim() }),
    });
    if (response.ok) {
      const data = await response.json();
      setMessages((current) =>
        current.map((entry) =>
          entry.id === messageId ? { ...entry, ...data.message } : entry,
        ),
      );
      setEditingId(undefined);
      setEditDraft("");
    }
  }

  return (
    <div className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <h2 className="mb-3 px-2 text-sm font-semibold text-white">Conversations</h2>
        {loading ? (
          <p className="px-2 text-xs text-white/60">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-xs text-white/60">No conversations yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left transition ${
                    activeId === entry.id ? "bg-white/15" : "hover:bg-white/8"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-white">
                    {entry.peer.name}
                  </p>
                  <p className="truncate text-[11px] text-white/55">
                    @{entry.peer.handle}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="flex min-h-[60vh] flex-col rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">
            {activeConversation?.peer.name ??
              (targetHandle ? `@${targetHandle}` : "Select a conversation")}
          </h2>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${
                message.isOwn ? "items-end" : "items-start"
              }`}
            >
              {message.warnNonFriend && !message.isOwn ? (
                <p className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-medium text-amber-200">
                  This person is not your friend
                </p>
              ) : null}
              {editingId === message.id ? (
                <div className="flex w-full max-w-md flex-col gap-2">
                  <textarea
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    className="min-h-[72px] rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSaveEdit(message.id)}
                      className="rounded-lg bg-brand-pink/80 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(undefined)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.isOwn
                      ? "bg-brand-pink/25 text-white"
                      : "bg-black/40 text-white/90"
                  }`}
                >
                  {message.content}
                  {message.editedAt ? (
                    <span className="mt-1 block text-[10px] text-white/45">
                      edited
                    </span>
                  ) : null}
                </div>
              )}
              {message.isOwn && editingId !== message.id ? (
                <div className="flex gap-2 text-white/50">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(message.id);
                      setEditDraft(message.content);
                    }}
                    aria-label="Edit message"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(message.id)}
                    aria-label="Delete message"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <form
          onSubmit={(event) => void handleSend(event)}
          className="border-t border-white/10 p-4"
        >
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                activeConversation || targetHandle
                  ? "Write a message…"
                  : "Select or start a conversation"
              }
              disabled={!activeConversation && !targetHandle}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
            />
            <button
              type="submit"
              disabled={sending || (!activeConversation && !targetHandle)}
              className="rounded-xl bg-brand-pink/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
