import type { BottomNavigationItemType } from "@sito/dashboard-app";

export const isBottomNavItemActive = (
  pathname: string,
  item: BottomNavigationItemType,
) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to));
