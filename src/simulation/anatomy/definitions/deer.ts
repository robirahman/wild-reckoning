import type { AnatomyDefinition, TissueType, BodyPart, Capability } from '../types';
import { StatId } from '../../../types/stats';

// ── Tissue Types ──

const tissues: TissueType[] = [
  {
    id: 'bone',
    label: 'Bone',
    fractureThreshold: 70,
    healingRate: 0.04, // ~25 turns to fully heal
    painSensitivity: 0.8,
    bleedRate: 0.1,
    infectionSusceptibility: 0.2,
  },
  {
    id: 'muscle',
    label: 'Muscle',
    fractureThreshold: 40,
    healingRate: 0.08, // ~12 turns to fully heal
    painSensitivity: 0.6,
    bleedRate: 0.4,
    infectionSusceptibility: 0.3,
  },
  {
    id: 'skin',
    label: 'Skin',
    fractureThreshold: 25,
    healingRate: 0.12, // ~8 turns to fully heal
    painSensitivity: 0.5,
    bleedRate: 0.6,
    infectionSusceptibility: 0.5,
  },
  {
    id: 'tendon',
    label: 'Tendon',
    fractureThreshold: 55,
    healingRate: 0.03, // ~33 turns -- tendons heal slowly
    painSensitivity: 0.9,
    bleedRate: 0.1,
    infectionSusceptibility: 0.15,
  },
  {
    id: 'nerve',
    label: 'Nerve',
    fractureThreshold: 30,
    healingRate: 0.01, // nerves barely heal
    painSensitivity: 1.0,
    bleedRate: 0.0,
    infectionSusceptibility: 0.1,
  },
  {
    id: 'organ',
    label: 'Organ',
    fractureThreshold: 35,
    healingRate: 0.05,
    painSensitivity: 0.7,
    bleedRate: 0.8,
    infectionSusceptibility: 0.6,
  },
  {
    id: 'cartilage',
    label: 'Cartilage',
    fractureThreshold: 45,
    healingRate: 0.02, // cartilage heals very slowly
    painSensitivity: 0.3,
    bleedRate: 0.05,
    infectionSusceptibility: 0.1,
  },
  {
    id: 'eye-tissue',
    label: 'Eye Tissue',
    fractureThreshold: 15,
    healingRate: 0.02,
    painSensitivity: 1.0,
    bleedRate: 0.2,
    infectionSusceptibility: 0.7,
  },
  {
    id: 'antler',
    label: 'Antler',
    fractureThreshold: 60,
    healingRate: 0.0, // antlers don't heal; they regrow seasonally
    painSensitivity: 0.1, // mature antler has no nerves
    bleedRate: 0.0,
    infectionSusceptibility: 0.0,
  },
];

// ── Body Parts ──

const bodyParts: BodyPart[] = [
  // ═══════════════════════════════
  //  TORSO (root)
  // ═══════════════════════════════
  {
    id: 'torso',
    label: 'torso',
    tissues: ['muscle', 'skin', 'bone'],
    capabilityContributions: [],
    vital: false,
    targetWeight: 0.25,
    zone: 'torso',
  },
  {
    id: 'spine',
    label: 'spine',
    parent: 'torso',
    tissues: ['bone', 'nerve', 'cartilage'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.15 },
    ],
    vital: true,
    targetWeight: 0.05,
    zone: 'torso',
  },
  {
    id: 'ribcage',
    label: 'ribcage',
    parent: 'torso',
    tissues: ['bone'],
    capabilityContributions: [
      { capabilityId: 'breathing', weight: 0.2 },
    ],
    vital: false,
    targetWeight: 0.08,
    zone: 'torso',
  },
  {
    id: 'lungs',
    label: 'lungs',
    parent: 'torso',
    tissues: ['organ'],
    capabilityContributions: [
      { capabilityId: 'breathing', weight: 0.5 },
    ],
    vital: true,
    targetWeight: 0.03,
    zone: 'internal',
  },
  {
    id: 'heart',
    label: 'heart',
    parent: 'torso',
    tissues: ['organ'],
    capabilityContributions: [
      { capabilityId: 'breathing', weight: 0.3 }, // cardiac failure = can't oxygenate
    ],
    vital: true,
    targetWeight: 0.02,
    zone: 'internal',
  },
  {
    id: 'stomach',
    label: 'stomach and rumen',
    parent: 'torso',
    tissues: ['organ'],
    capabilityContributions: [
      { capabilityId: 'digestion', weight: 0.5 },
    ],
    vital: false,
    targetWeight: 0.04,
    zone: 'internal',
  },
  {
    id: 'intestines',
    label: 'intestines',
    parent: 'torso',
    tissues: ['organ'],
    capabilityContributions: [
      { capabilityId: 'digestion', weight: 0.4 },
    ],
    vital: false,
    targetWeight: 0.04,
    zone: 'internal',
  },
  {
    id: 'liver',
    label: 'liver',
    parent: 'torso',
    tissues: ['organ'],
    capabilityContributions: [
      { capabilityId: 'digestion', weight: 0.1 },
    ],
    vital: true,
    targetWeight: 0.02,
    zone: 'internal',
  },

  // ═══════════════════════════════
  //  NECK
  // ═══════════════════════════════
  {
    id: 'neck',
    label: 'neck',
    parent: 'torso',
    tissues: ['muscle', 'skin', 'bone'],
    capabilityContributions: [
      { capabilityId: 'breathing', weight: 0.0 }, // trachea
    ],
    vital: true,
    targetWeight: 0.06,
    zone: 'neck',
  },

  // ═══════════════════════════════
  //  HEAD
  // ═══════════════════════════════
  {
    id: 'head',
    label: 'head',
    parent: 'neck',
    tissues: ['skin', 'muscle'],
    capabilityContributions: [],
    vital: false,
    targetWeight: 0.05,
    zone: 'head',
  },
  {
    id: 'skull',
    label: 'skull',
    parent: 'head',
    tissues: ['bone'],
    capabilityContributions: [],
    vital: true,
    targetWeight: 0.03,
    zone: 'head',
  },
  {
    id: 'brain',
    label: 'brain',
    parent: 'skull',
    tissues: ['nerve', 'organ'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.05 },
      { capabilityId: 'vision', weight: 0.1 },
    ],
    vital: true,
    targetWeight: 0.01,
    zone: 'internal',
  },
  {
    id: 'left-eye',
    label: 'left eye',
    parent: 'head',
    tissues: ['eye-tissue'],
    capabilityContributions: [
      { capabilityId: 'vision', weight: 0.45 },
    ],
    bilateral: 'right-eye',
    vital: false,
    targetWeight: 0.01,
    zone: 'head',
  },
  {
    id: 'right-eye',
    label: 'right eye',
    parent: 'head',
    tissues: ['eye-tissue'],
    capabilityContributions: [
      { capabilityId: 'vision', weight: 0.45 },
    ],
    bilateral: 'left-eye',
    vital: false,
    targetWeight: 0.01,
    zone: 'head',
  },
  {
    id: 'jaw',
    label: 'jaw',
    parent: 'head',
    tissues: ['bone', 'muscle'],
    capabilityContributions: [
      { capabilityId: 'digestion', weight: 0.0 }, // can't eat with broken jaw, but not primary
    ],
    vital: false,
    targetWeight: 0.02,
    zone: 'head',
  },
  {
    id: 'left-antler',
    label: 'left antler',
    parent: 'head',
    tissues: ['antler'],
    capabilityContributions: [],
    bilateral: 'right-antler',
    vital: false,
    targetWeight: 0.02,
    zone: 'head',
    conditional: { sex: 'male', seasonal: true },
  },
  {
    id: 'right-antler',
    label: 'right antler',
    parent: 'head',
    tissues: ['antler'],
    capabilityContributions: [],
    bilateral: 'left-antler',
    vital: false,
    targetWeight: 0.02,
    zone: 'head',
    conditional: { sex: 'male', seasonal: true },
  },

  // ═══════════════════════════════
  //  FRONT LEFT LEG
  // ═══════════════════════════════
  {
    id: 'front-left-shoulder',
    label: 'front left shoulder',
    parent: 'torso',
    tissues: ['muscle', 'tendon', 'cartilage'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.06 },
    ],
    vital: false,
    targetWeight: 0.03,
    zone: 'front-legs',
  },
  {
    id: 'front-left-humerus',
    label: 'front left humerus',
    parent: 'front-left-shoulder',
    tissues: ['bone', 'muscle'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.05 },
    ],
    bilateral: 'front-right-humerus',
    vital: false,
    targetWeight: 0.02,
    zone: 'front-legs',
  },
  {
    id: 'front-left-ulna',
    label: 'front left ulna',
    parent: 'front-left-humerus',
    tissues: ['bone'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.04 },
    ],
    bilateral: 'front-right-ulna',
    vital: false,
    targetWeight: 0.015,
    zone: 'front-legs',
  },
  {
    id: 'front-left-hoof',
    label: 'front left hoof',
    parent: 'front-left-ulna',
    tissues: ['cartilage', 'skin'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.03 },
    ],
    bilateral: 'front-right-hoof',
    vital: false,
    targetWeight: 0.01,
    zone: 'front-legs',
  },

  // ═══════════════════════════════
  //  FRONT RIGHT LEG (bilateral mirror)
  // ═══════════════════════════════
  {
    id: 'front-right-shoulder',
    label: 'front right shoulder',
    parent: 'torso',
    tissues: ['muscle', 'tendon', 'cartilage'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.06 },
    ],
    vital: false,
    targetWeight: 0.03,
    zone: 'front-legs',
  },
  {
    id: 'front-right-humerus',
    label: 'front right humerus',
    parent: 'front-right-shoulder',
    tissues: ['bone', 'muscle'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.05 },
    ],
    bilateral: 'front-left-humerus',
    vital: false,
    targetWeight: 0.02,
    zone: 'front-legs',
  },
  {
    id: 'front-right-ulna',
    label: 'front right ulna',
    parent: 'front-right-humerus',
    tissues: ['bone'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.04 },
    ],
    bilateral: 'front-left-ulna',
    vital: false,
    targetWeight: 0.015,
    zone: 'front-legs',
  },
  {
    id: 'front-right-hoof',
    label: 'front right hoof',
    parent: 'front-right-ulna',
    tissues: ['cartilage', 'skin'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.03 },
    ],
    bilateral: 'front-left-hoof',
    vital: false,
    targetWeight: 0.01,
    zone: 'front-legs',
  },

  // ═══════════════════════════════
  //  HIND LEFT LEG
  // ═══════════════════════════════
  {
    id: 'hind-left-hip',
    label: 'left hip',
    parent: 'torso',
    tissues: ['muscle', 'tendon', 'cartilage'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.07 },
    ],
    vital: false,
    targetWeight: 0.03,
    zone: 'hind-legs',
  },
  {
    id: 'hind-left-femur',
    label: 'left femur',
    parent: 'hind-left-hip',
    tissues: ['bone', 'muscle'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.06 },
    ],
    bilateral: 'hind-right-femur',
    vital: false,
    targetWeight: 0.025,
    zone: 'hind-legs',
  },
  {
    id: 'hind-left-tibia',
    label: 'left tibia',
    parent: 'hind-left-femur',
    tissues: ['bone'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.04 },
    ],
    bilateral: 'hind-right-tibia',
    vital: false,
    targetWeight: 0.015,
    zone: 'hind-legs',
  },
  {
    id: 'hind-left-hoof',
    label: 'hind left hoof',
    parent: 'hind-left-tibia',
    tissues: ['cartilage', 'skin'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.03 },
    ],
    bilateral: 'hind-right-hoof',
    vital: false,
    targetWeight: 0.01,
    zone: 'hind-legs',
  },

  // ═══════════════════════════════
  //  HIND RIGHT LEG (bilateral mirror)
  // ═══════════════════════════════
  {
    id: 'hind-right-hip',
    label: 'right hip',
    parent: 'torso',
    tissues: ['muscle', 'tendon', 'cartilage'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.07 },
    ],
    vital: false,
    targetWeight: 0.03,
    zone: 'hind-legs',
  },
  {
    id: 'hind-right-femur',
    label: 'right femur',
    parent: 'hind-right-hip',
    tissues: ['bone', 'muscle'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.06 },
    ],
    bilateral: 'hind-left-femur',
    vital: false,
    targetWeight: 0.025,
    zone: 'hind-legs',
  },
  {
    id: 'hind-right-tibia',
    label: 'right tibia',
    parent: 'hind-right-femur',
    tissues: ['bone'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.04 },
    ],
    bilateral: 'hind-left-tibia',
    vital: false,
    targetWeight: 0.015,
    zone: 'hind-legs',
  },
  {
    id: 'hind-right-hoof',
    label: 'hind right hoof',
    parent: 'hind-right-tibia',
    tissues: ['cartilage', 'skin'],
    capabilityContributions: [
      { capabilityId: 'locomotion', weight: 0.03 },
    ],
    bilateral: 'hind-left-hoof',
    vital: false,
    targetWeight: 0.01,
    zone: 'hind-legs',
  },

  // ═══════════════════════════════
  //  TAIL
  // ═══════════════════════════════
  {
    id: 'tail',
    label: 'tail',
    parent: 'torso',
    tissues: ['muscle', 'skin', 'bone'],
    capabilityContributions: [],
    vital: false,
    targetWeight: 0.01,
    zone: 'tail',
  },
];

// ── Capabilities ──

const capabilities: Capability[] = [
  {
    id: 'locomotion',
    label: 'Locomotion',
    statMappings: [
      { stat: StatId.STR, perPointImpairment: 0.3 }, // impaired movement -> stress
      { stat: StatId.HOM, perPointImpairment: 0.15 }, // strain on homeostasis
    ],
    survivalCritical: false, // severe impairment increases predation risk but isn't instant death
  },
  {
    id: 'vision',
    label: 'Vision',
    statMappings: [
      { stat: StatId.ADV, perPointImpairment: 0.2 }, // harder to navigate
      { stat: StatId.NOV, perPointImpairment: 0.15 }, // more disorienting
    ],
    survivalCritical: false,
  },
  {
    id: 'breathing',
    label: 'Breathing',
    statMappings: [
      { stat: StatId.HOM, perPointImpairment: 0.5 }, // severe homeostatic disruption
      { stat: StatId.HEA, perPointImpairment: -0.4 }, // direct health loss
    ],
    survivalCritical: true,
    deathCause: 'Respiratory failure',
  },
  {
    id: 'digestion',
    label: 'Digestion',
    statMappings: [
      { stat: StatId.HOM, perPointImpairment: 0.2 }, // metabolic disruption
    ],
    survivalCritical: false, // starvation is handled by weight system, not instant death
  },
];

// ── Export ──

export const DEER_ANATOMY: AnatomyDefinition = {
  speciesId: 'white-tailed-deer',
  tissues,
  bodyParts,
  capabilities,
};
