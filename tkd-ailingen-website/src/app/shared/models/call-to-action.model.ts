/**
 * Call-to-action model
 * Represents action buttons for user engagement
 */

export type ActionType = 'mailto' | 'route' | 'external';
export type ButtonStyle = 'primary' | 'accent' | 'warn';

export interface CallToAction {
  id: string;
  label: string;
  actionType: ActionType;
  destination: string; // Email, route path, or URL
  buttonStyle: ButtonStyle;
  priority: number; // Display order (lower = higher priority)
  icon?: string;
  ariaLabel?: string;
}

export interface CTACollection {
  actions: CallToAction[];
}

// Alias for convenience in components
export type CTAButton = CallToAction;
