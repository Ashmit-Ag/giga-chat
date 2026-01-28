'use client';

import { Smile } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Theme } from 'emoji-picker-react';
import { notifications } from '@mantine/notifications';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function EmojiInput({
  value,
  onChange,
  connected,
  canUseEmoji,
}: {
  value: string;
  onChange: (v: string) => void;
  connected: boolean;
  canUseEmoji?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={!connected}
        onClick={() => {
          // 🔴 Hard block (not connected)
          if (!connected) return;

          // 🟡 Soft block (plan restriction)
          if (!canUseEmoji) {
            notifications.show({
              title: 'Upgrade Required',
              message: 'Upgrade your plan to use emojis.',
              color: 'yellow',
              autoClose: 4000,
            });
            return;
          }

          setShow((prev) => !prev);
        }}
        className={`pr-3 px-1 rounded-md ${
          !connected ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        <Smile className="w-5 h-5 text-zinc-300" />
      </button>

      {show && connected && canUseEmoji && (
        <div className="absolute bottom-12 -right-12 z-50 mt-2">
          <Picker
            theme={Theme.DARK}
            searchDisabled
            skinTonesDisabled
            onEmojiClick={(emoji) => {
              onChange(value + emoji.emoji);
            }}
          />
        </div>
      )}
    </div>
  );
}
