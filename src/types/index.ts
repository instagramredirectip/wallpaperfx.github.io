// src/types/index.ts

/**
 * Defines the structure of a Wallpaper object as used across the application.
 * This ensures type consistency between Server and Client Components.
 */
export interface Wallpaper {
  id: string; // The UUID from the Supabase table
  url_thumb: string; // URL for the optimized thumbnail image
  url_full: string; // URL for the high-resolution download
  title: string;
  tags: string[];
}