import { create } from 'zustand';
import type { LikesSummary } from '@/app/types';

interface LikeState {
  items: LikesSummary['items'];
  likedProductIds: Set<string>;
  totalCount: number;
  hasLoaded: boolean;
  setLikes: (likes: LikesSummary) => void;
  clearLikes: () => void;
}

export const useLikeStore = create<LikeState>()((set) => ({
  items: [],
  likedProductIds: new Set(),
  totalCount: 0,
  hasLoaded: false,
  setLikes: (likes) =>
    set({
      items: likes.items,
      likedProductIds: new Set(likes.items.map((item) => item.productId)),
      totalCount: likes.totalCount,
      hasLoaded: true,
    }),
  clearLikes: () => set({ items: [], likedProductIds: new Set(), totalCount: 0, hasLoaded: true }),
}));
