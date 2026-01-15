/**
 * Navigation item model
 * Represents menu links in the navigation header
 */

export interface NavigationItem {
  id: string;
  label: string;
  routeOrAnchor: string; // Route path or anchor (#section-id)
  icon?: string;
  order: number;
  subItems?: NavigationItem[];
  externalUrl?: string;
}

export interface Navigation {
  items: NavigationItem[];
}
