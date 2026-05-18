"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
  id: number;
  room_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  // ── Tìm hoặc tạo phòng ──
  const ensureRoom = useCallback(async () => {
    if (!userId) return;
    const { data: rooms } = await supabase
      .from("support_rooms")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "open")
      .limit(1);
    if (rooms && rooms.length > 0) {
      setRoomId(rooms[0].id);
      return rooms[0].id;
    }
    const { data: created } = await supabase
      .from("support_rooms")
      .insert({ user_id: userId, status: "open" })
      .select("id")
      .single();
    if (created) setRoomId(created.id);
    return created?.id || null;
  }, [userId]);

  // ── Load tin nhắn cũ ──
  const loadMessages = useCallback(async (rid: string) => {
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("room_id", rid)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, []);

  // ── Realtime ──
  const subscribeRoom = useCallback((rid: string) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`room_${rid.slice(0, 8)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `room_id=eq.${rid}`,
        },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe();
  }, []);

  // ── Mở chat ──
  const handleOpen = useCallback(async () => {
    setOpen(true);
    if (!userId) return;
    setLoading(true);
    const rid = await ensureRoom();
    if (rid) {
      await loadMessages(rid);
      subscribeRoom(rid);
    }
    setLoading(false);
  }, [userId, ensureRoom, loadMessages, subscribeRoom]);

  // ── Gửi tin nhắn ──
  const handleSend = async () => {
    if (!input.trim() || !roomId || !userId) return;
    await supabase.from("support_messages").insert({
      room_id: roomId,
      sender_id: userId,
      message: input.trim(),
    });
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  // ── Auto-scroll ──
  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end gap-3">
      {/* Khung chat */}
      {open && (
        <div className="w-80 h-96 bg-gray-950 rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white font-black text-xs uppercase tracking-wide">
                AFKplay Support
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
          >
            {!userId ? (
              <div className="text-center text-gray-400 text-xs mt-10 px-2">
                Please <span className="text-purple-400 font-bold">log in</span>{" "}
                to your AFKplay account to send support requests or recover your
                password.
              </div>
            ) : loading ? (
              <div className="text-center text-gray-500 text-xs mt-10">
                Connecting...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 text-xs mt-10">
                👋 Hello! Send a message to get help.
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.sender_id === userId;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                        isMine
                          ? "bg-purple-600 text-white rounded-br-md"
                          : "bg-gray-700 text-gray-200 rounded-bl-md"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {userId && (
            <div className="px-3 py-2 border-t border-gray-800 flex gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-xl outline-none placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-500 disabled:opacity-40 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Nút bong bóng */}
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="w-14 h-14 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        {open ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
    </div>
  );
}
