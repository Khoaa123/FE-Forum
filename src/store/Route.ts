import { create } from "zustand";

type RouteStore = {
  routeHistory: string[];
  currentRoute: string;
  setRouteHistory: (route: string) => void;
  setCurrentRoute: (route: string) => void;
};
export const useRouteStore = create<RouteStore>((set) => ({
  routeHistory: [],
  currentRoute: "",
  setRouteHistory: (route) =>
    set((state) => ({
      routeHistory:
        state.currentRoute === route
          ? state.routeHistory
          : [...state.routeHistory, route],
      currentRoute: route,
    })),
  setCurrentRoute: (route) =>
    set((state) => ({
      ...state,
      currentRoute: route,
      routeHistory:
        state.currentRoute === route
          ? state.routeHistory
          : [...state.routeHistory, route],
    })),
}));
