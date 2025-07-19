// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  username: string;
  monthly_income: number | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, monthly_income, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user logged in");

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: updates.username,
          monthly_income: updates.monthly_income,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) =>
        prev ? { ...prev, ...updates } : { id: user.id, ...updates } as Profile
      );
    } catch (err: any) {
      throw new Error(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const subscription = supabase
      .channel("profiles")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  return { profile, isLoading, error, updateProfile };
};