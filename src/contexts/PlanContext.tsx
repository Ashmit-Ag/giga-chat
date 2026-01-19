"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

interface PlanLimitations {
  planName: string;
  pfp_edit: boolean;
  name_edit: boolean;
  can_send_gifs: boolean;
  can_send_videos: boolean;
  can_send_emojis: boolean;
  chat_cooldown: number;
  chats_left: number;
  chat_timer: number;
  max_friend_req: number;
  min_match_time: number;
}

interface PlanContextType {
  state: PlanLimitations | null;
  loading: boolean;
  getSearchCooldown: () => number;
  refreshPlan: () => Promise<void>;
  decreaseChat: () => Promise<boolean>;
  clearPlan: () => void; // New function exposed
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const COOKIE_NAME = 'user_plan_v3';

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlanLimitations | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Clears the plan data from both local state and browser cookies.
   */
  const clearPlan = useCallback(() => {
    Cookies.remove(COOKIE_NAME);
    setState(null);
  }, []);

  /**
   * Fetches fresh plan data from the server and updates state/cookies.
   */
  const fetchUserPlan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/plan-details');
      const data = await response.json();

      if (data.success) {
        const planData: PlanLimitations = {
          planName: data.planName,
          pfp_edit: data.limitations.pfp_edit,
          name_edit: data.limitations.name_edit,
          can_send_gifs: data.limitations.can_send_gifs,
          can_send_videos: data.limitations.can_send_videos,
          can_send_emojis: data.limitations.can_send_emojis,
          chat_cooldown: data.limitations.chat_cooldown,
          chats_left: data.limitations.chats_left,
          chat_timer: data.limitations.chat_timer,
          max_friend_req: data.limitations.max_friend_req,
          min_match_time: 0,
        };

        setState(planData);
        Cookies.set(COOKIE_NAME, JSON.stringify(planData), { expires: 1 });
      } else {
        // If API returns success: false, clear local data
        clearPlan();
      }
    } catch (error) {
      console.error("Plan Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [clearPlan]);

  const getSearchCooldown = useCallback(() => {
    if (!state) return 5000;
    const base = state.min_match_time * 1000;
    const randomOffset = (Math.floor(Math.random() * (20 - 2 + 1)) + 2) * 1000;
    return base + randomOffset;
  }, [state]);

  const decreaseChat = useCallback(async () => {
    if (!state || state.chats_left <= 0) return false;
  
    // Optimistic update
    setState((prev) =>
      prev ? { ...prev, chats_left: Math.max(prev.chats_left - 1, 0) } : prev
    );
  
    try {
      const res = await fetch("/api/user", { method: "POST" });
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error("Failed to decrease chat");
      }
  
      // Sync with server authoritative response
      const updatedState = state ? { ...state, chats_left: data.chats_left } : null;
      
      if (updatedState) {
        setState(updatedState);
        Cookies.set(COOKIE_NAME, JSON.stringify(updatedState), { expires: 1 });
      }
  
      return true;
    } catch (error) {
      console.error("Chat decrease failed:", error);
  
      // Rollback on failure
      setState((prev) =>
        prev ? { ...prev, chats_left: prev.chats_left + 1 } : prev
      );
  
      return false;
    }
  }, [state]);

  // Handle Initial Load
  useEffect(() => {
    const saved = Cookies.get(COOKIE_NAME);
    if (saved) {
      try {
        setState(JSON.parse(saved));
        setLoading(false);
      } catch (err) {
        console.error("Error parsing plan cookie:", err);
        fetchUserPlan();
      }
    } else {
      fetchUserPlan();
    }
  }, [fetchUserPlan]);

  return (
    <PlanContext.Provider 
      value={{ 
        state, 
        loading, 
        getSearchCooldown, 
        refreshPlan: fetchUserPlan, 
        decreaseChat, 
        clearPlan 
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used within PlanProvider");
  return context;
};