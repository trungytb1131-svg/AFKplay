"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Send } from "lucide-react";

type Room = { id: string; user_id: string; status: string; created_at: string };
type Message = { id: number; room_id: string; sender_id: string; message: string; created_at: string };

export default function AdminChat() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setAdminId(data.user.id);
    });
  }, []);

  // Load rooms
  useEffect(() => {
    if (!adminId) return;
    supabase
      .from("support_rooms")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRooms(data); });
  }, [adminId]);

  // Load messages
  const loadRoom = useCallback(async (roomId: string) => {
    setSelectedRoom(roomId);
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, []);

  // Realtime
  useEffect(() => {
    if (!selectedRoom) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`admin_${selectedRoom.slice(0, 8)}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "support_messages",
        filter: `room_id=eq.${selectedRoom}`,
      }, (payload) => setMessages((prev) => [...prev, payload.new as Message]))
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [selectedRoom]);

  // Auto-scroll
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedRoom || !adminId) return;
    await supabase.from("support_messages").insert({
      room_id: selectedRoom, sender_id: adminId, message: input.trim(),
    });
    setInput("");
  };

  if (!adminId) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Please log in with your admin account.
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-3 border-b border-gray-800">
          <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <span className="text-white font-bold text-sm">Room {selectedRoom.slice(0, 8)}</span>
        </div>
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {messages.map((m) => {
            const isAdmin = m.sender_id === adminId;
            return (
              <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${isAdmin ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-700 text-gray-200 rounded-bl-md"}`}>
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-gray-800 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Reply..."
            className="flex-1 bg-gray-800 text-white text-sm px-4 py-2 rounded-xl outline-none" />
          <button onClick={handleSend} disabled={!input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 disabled:opacity-40">
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-white text-xl font-black mb-6">Support Rooms</h1>
      <div className="space-y-2">
        {rooms.map((r) => (
          <button key={r.id} onClick={() => loadRoom(r.id)}
            className="w-full text-left bg-gray-900 hover:bg-gray-800 rounded-xl px-4 py-3 text-white text-sm transition-colors">
            Room {r.id.slice(0, 8)} — {new Date(r.created_at).toLocaleDateString()}
          </button>
        ))}
        {rooms.length === 0 && <p className="text-gray-500 text-sm">No open rooms.</p>}
      </div>
    </div>
  );
}
