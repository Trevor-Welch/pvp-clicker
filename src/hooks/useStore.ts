// src/hooks/useStore.ts
import { db } from "../firebase";
import { ref, runTransaction } from "firebase/database";

interface StoreItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
  passiveIncomeBonus: number;
  icon?: string;
}

export const useStore = (roomId: string, currentPlayer: "p1" | "p2" | null) => {
  const purchaseItem = async (item: StoreItemData) => {
    if (!roomId || !currentPlayer) return;

    const playerRef = ref(db, `rooms/${roomId}/${currentPlayer}`);

    await runTransaction(playerRef, (player) => {
      // Player data might be just clicks initially → normalize to an object
      if (player == null) return player;

      // If your schema is still a number, upgrade it here:
      if (typeof player === "number") {
        return {
          clicks: player - item.cost >= 0 ? player - item.cost : player,
          passiveIncome: item.passiveIncomeBonus, // first item purchased
        };
      }

      if (player.clicks < item.cost) return player; // can’t afford

      return {
        ...player,
        clicks: player.clicks - item.cost,
        passiveIncome: (player.passiveIncome || 0) + item.passiveIncomeBonus,
      };
    });
  };

  return { purchaseItem };
};
