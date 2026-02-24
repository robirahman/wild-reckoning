/** Phase 14: Encyclopedia/Bestiary types */

export interface EncyclopediaEntry {
  id: string;
  category: 'species' | 'ecology' | 'behavior' | 'anatomy' | 'habitat';
  title: string;
  content: string;
  unlockCondition:
    | { type: 'species_played'; speciesId: string }
    | { type: 'achievement'; achievementId: string }
    | { type: 'flag_seen'; flag: string }
    | { type: 'default' }; // always unlocked
}
