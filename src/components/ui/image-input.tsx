"use client";

import React, { useRef, useState } from "react";
import { ImageIcon, Loader2, Send } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

interface ImageInputProps {
  onSendMessage: (content: string, type: "text" | "image") => void;
  disabled?: boolean;
}

export default function ImageInput({ onSendMessage, disabled }: ImageInputProps) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Mock API Upload Function
  const uploadImageToDB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // Replace this with your actual endpoint (e.g., Cloudinary, S3, or local API)
    const response = await fetch("/api/user/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error("Upload failed");
    
    return data.url; // The hosted link returned by your DB/Storage
  };

  // 2. Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic client-side validation
    if (!file.type.startsWith("image/")) {
      notifications.show({
        title: 'Invalid File',
        message: 'Please select an image file.',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    try {
      setIsUploading(true);
      const hostedUrl = await uploadImageToDB(file);
      
      // 3. Send the hosted link through the socket
      onSendMessage(hostedUrl, "image");
      
      // Reset input so the same image can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      notifications.show({
        title: 'Upload Failed',
        message: 'Failed to upload image.',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendText = () => {
    if (!text.trim()) return;
    onSendMessage(text, "text");
    setText("");
  };

  return (
    <div className="p-4 bg-black/20 border-t border-white/10">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        
        {/* IMAGE UPLOAD BUTTON */}
        <div className="relative">
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6 text-white/70" />
            )}
          </button>

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* TEXT INPUT */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendText()}
          placeholder={isUploading ? "Uploading image..." : "Type a message..."}
          disabled={disabled || isUploading}
          className="flex-1 bg-white/5 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
        />

        {/* SEND BUTTON */}
        <button
          onClick={handleSendText}
          disabled={disabled || !text.trim() || isUploading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-white/5"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}