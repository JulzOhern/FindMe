import { create } from "zustand";

type SideBarState = {
  isOpen: boolean;
  toggle: () => void;
};

type TrackFriends = {
  userId: string
  setUserId: (userId: string) => void
}

export const useSideBarStore = create<SideBarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useTrackFriendsStore = create<TrackFriends>((set) => ({
  userId: '',
  setUserId: (userId: string) => set((state) => ({ userId: userId === state.userId ? "" : userId })),
}))