import type { BehavioralSettings } from '../../types/behavior';

/**
 * An instinct nudge is an advisory signal from the animal's instincts
 * about a behavioral setting that may need adjustment.
 *
 * Per the vision document: "things like hinting that the animal is anxious
 * when in an open area... a little status modifier that appears upon hover."
 *
 * Nudges are purely informational. They do NOT auto-adjust settings.
 * The player retains full control.
 */
export interface InstinctNudge {
  /** Unique identifier for this nudge type */
  id: string;
  /** Short label displayed as a badge (e.g., "Exposed", "Starving") */
  label: string;
  /** Longer description shown on hover/expand */
  description: string;
  /** Which behavioral setting this nudge relates to, if any */
  suggestedBehavior?: keyof BehavioralSettings;
  /** Suggested direction: increase or decrease the setting */
  suggestedDirection?: 'increase' | 'decrease';
  /** Priority determines display order and visual emphasis */
  priority: 'low' | 'medium' | 'high';
  /** What system generated this nudge (for grouping/filtering) */
  source: 'terrain' | 'physiology' | 'weather' | 'social' | 'injury' | 'reproductive';
}
