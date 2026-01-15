/**
 * Trainer role types
 * Defines the organizational role of a trainer
 */
export type TrainerRole = 'head-instructor' | 'instructor' | 'assistant' | 'youth-protection-officer' | null;

/**
 * Program types a trainer can teach
 */
export type TrainerProgram = 'taekwondo' | 'zumba' | 'deepwork';

/**
 * Special roles or certifications a trainer may have
 */
export type SpecialRole = 'youth-protection-officer' | 'first-aid-certified' | 'competition-judge';

/**
 * Trainer profile interface
 * Represents a trainer/instructor at the club
 */
export interface Trainer {
  /** Unique identifier for the trainer */
  id: string;
  
  /** Trainer's first name */
  firstName: string;
  
  /** Trainer's last name */
  lastName: string;
  
  /** Full name (computed: firstName + lastName) */
  fullName: string;
  
  /** Primary organizational role */
  role: TrainerRole;
  
  /** Programs this trainer teaches */
  programs: TrainerProgram[];
  
  /** Session labels for taekwondo trainers (e.g., "Kinder 6-12 Jahre, Anfänger") */
  sessions?: string[];
  
  /** Special roles or certifications */
  specialRoles?: SpecialRole[];
  
  /** Optional biography or description */
  bio?: string;
  
  /** Path to trainer photo (JPEG) */
  photoUrl: string;
  
  /** Path to trainer photo (WebP format for better compression) */
  photoWebP?: string;
  
  /** Sort key for German alphabetical sorting */
  sortKey: string;
}

/**
 * Generates a sort key for German locale sorting
 * Handles umlauts (ä, ö, ü) according to German sorting rules
 * 
 * @param lastName - Trainer's last name
 * @param firstName - Trainer's first name
 * @returns Sort key for alphabetical ordering
 */
export function generateSortKey(lastName: string, firstName: string): string {
  // Combine last name and first name for sorting
  const fullName = `${lastName} ${firstName}`;
  
  // Normalize for German sorting (lowercase, remove accents for comparison)
  // Note: localeCompare will handle the actual sorting, this is just for consistency
  return fullName.toLowerCase();
}

/**
 * Helper to create full name from first and last name
 * 
 * @param firstName - Trainer's first name
 * @param lastName - Trainer's last name
 * @returns Full name in "FirstName LastName" format
 */
export function createFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
