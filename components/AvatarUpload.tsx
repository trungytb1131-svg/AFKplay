"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Props {
  currentUrl?: string | null;
  userId: string;
  onUploaded: (url: string) => void;
  size?: number;
}

export default function AvatarUpload({ currentUrl, userId, onUploaded, size = 40 }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${userId}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl;
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", userId);
    onUploaded(avatarUrl);
    setUploading(false);
  };

  if (currentUrl) {
    return (
      <div className="relative group shrink-0" style={{ width: size, height: size }}>
        <Image src={currentUrl} alt="Avatar" width={size} height={size} className="rounded-full object-cover border-2 border-white shadow-sm" />
        <button onClick={() => inputRef.current?.click()} className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={size * 0.4} className="text-white" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} hidden />
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <button onClick={() => inputRef.current?.click()} disabled={uploading} className="w-full h-full rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center hover:bg-slate-300 transition-colors">
        {uploading ? <Loader2 size={size * 0.4} className="animate-spin text-slate-400" /> : <Camera size={size * 0.4} className="text-slate-400" />}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} hidden />
    </div>
  );
}
