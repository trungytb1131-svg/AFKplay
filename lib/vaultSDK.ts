import { supabase } from "./supabase";
import { buildProfilePatch } from "./profileEconomy";

export const AFK_Vault = {
  async getUserProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Vault open error:", error.message);
      return null;
    }
    return data;
  },

  async saveGame(gameId: string, gameState: Record<string, unknown>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Please sign in to your Vault first!" };

    const profile = await this.getUserProfile();
    const allSaves = profile?.game_saves || {};

    const updatedSaves = {
      ...allSaves,
      [gameId]: {
        ...gameState,
        last_saved: new Date().toISOString(),
      },
    };

    const { error } = await supabase
      .from("profiles")
      .update({ game_saves: updatedSaves })
      .eq("id", user.id);

    if (error) return { error: error.message };
    return { success: true };
  },

  async awardStars(amount = 1) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Please sign in to your Vault first!" };

    const profile = await this.getUserProfile();
    if (!profile) return { error: "Profile not found" };

    const stars = (profile.stars ?? 5) + amount;
    const coins = profile.coins ?? 100;
    const patch = buildProfilePatch(
      coins,
      stars,
      profile.last_coin_at ?? new Date().toISOString()
    );

    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id);

    if (error) return { error: error.message };
    return { success: true, stars: patch.stars, rank: patch.rank };
  },
};
