"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { CommunityChatChannelId } from "@/lib/community-chat";
import { getSocketUrl } from "@/lib/env/socket";
import type { ChatMessage } from "@/types";

interface UseCommunityChatOptions {
  communitySlug: string;
  channel: CommunityChatChannelId;
  viewerUserId?: string;
  enabled: boolean;
}

export function useCommunityChat({
  communitySlug,
  channel,
  viewerUserId,
  enabled,
}: UseCommunityChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(undefined);

    fetch(
      `/api/communities/${encodeURIComponent(communitySlug)}/chat?channel=${encodeURIComponent(channel)}`,
      { credentials: "include" },
    )
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Could not load chat history.",
          );
        }
        if (!cancelled) {
          setMessages(
            Array.isArray(data.messages) ? (data.messages as ChatMessage[]) : [],
          );
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) setError(fetchError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [communitySlug, channel, enabled]);

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      return;
    }

    const socket = io(getSocketUrl(), {
      path: "/api/socket/io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError(undefined);
      socket.emit("chat:join", { communitySlug, channel });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (connectError) => {
      setConnected(false);
      setError(
        connectError.message.includes("Unauthorized")
          ? "Log in to use community chat."
          : "Could not connect to chat. Start the app with npm run dev (Socket.IO server).",
      );
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [
          ...current,
          {
            ...message,
            own: viewerUserId != null && message.author.id === viewerUserId,
          },
        ];
      });
    });

    socket.on("chat:error", (payload: { message?: string }) => {
      if (payload?.message) setError(payload.message);
    });

    return () => {
      socket.emit("chat:leave", { communitySlug, channel });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [communitySlug, channel, enabled, viewerUserId]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !socketRef.current?.connected) return;
      socketRef.current.emit("chat:send", {
        communitySlug,
        channel,
        content: trimmed,
      });
    },
    [communitySlug, channel],
  );

  return {
    messages,
    loading,
    connected,
    error,
    sendMessage,
  };
}
