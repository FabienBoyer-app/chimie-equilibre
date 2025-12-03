import { ElementColor, LevelData } from './types';

export const ATOM_COLORS: Record<string, ElementColor> = {
  H: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' },
  C: { bg: 'bg-slate-800', border: 'border-slate-900', text: 'text-white' },
  O: { bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' },
  N: { bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
  Cl: { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' },
  Na: { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-white' },
  Mg: { bg: 'bg-orange-400', border: 'border-orange-600', text: 'text-white' },
  S: { bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-yellow-900' },
  Fe: { bg: 'bg-orange-700', border: 'border-orange-900', text: 'text-white' },
  Al: { bg: 'bg-gray-400', border: 'border-gray-600', text: 'text-white' },
  default: { bg: 'bg-pink-400', border: 'border-pink-600', text: 'text-white' },
};

export const INITIAL_LEVELS: LevelData[] = [
  {
    id: 'l1',
    name: 'La Formation de l\'Eau',
    difficulty: 'Facile',
    description: "L'hydrogène réagit avec l'oxygène pour former de l'eau. C'est la base de la vie !",
    reactants: [
      { id: 'r1', formula: 'H₂', composition: { H: 2 }, coefficient: 1 },
      { id: 'r2', formula: 'O₂', composition: { O: 2 }, coefficient: 1 },
    ],
    products: [
      { id: 'p1', formula: 'H₂O', composition: { H: 2, O: 1 }, coefficient: 1 },
    ],
  },
  {
    id: 'l2',
    name: 'Combustion du Méthane',
    difficulty: 'Moyen',
    description: "Le méthane (gaz naturel) brûle dans l'oxygène pour donner du CO2 et de l'eau.",
    reactants: [
      { id: 'r1', formula: 'CH₄', composition: { C: 1, H: 4 }, coefficient: 1 },
      { id: 'r2', formula: 'O₂', composition: { O: 2 }, coefficient: 1 },
    ],
    products: [
      { id: 'p1', formula: 'CO₂', composition: { C: 1, O: 2 }, coefficient: 1 },
      { id: 'p2', formula: 'H₂O', composition: { H: 2, O: 1 }, coefficient: 1 },
    ],
  },
  {
    id: 'l3',
    name: 'Synthèse de l\'Ammoniac',
    difficulty: 'Moyen',
    description: "Le procédé Haber-Bosch permet de créer de l'ammoniac pour les engrais.",
    reactants: [
      { id: 'r1', formula: 'N₂', composition: { N: 2 }, coefficient: 1 },
      { id: 'r2', formula: 'H₂', composition: { H: 2 }, coefficient: 1 },
    ],
    products: [
      { id: 'p1', formula: 'NH₃', composition: { N: 1, H: 3 }, coefficient: 1 },
    ],
  },
  {
    id: 'l4',
    name: 'Formation de la Rouille',
    difficulty: 'Difficile',
    description: "Le fer rouille en présence d'oxygène et d'eau pour former de l'hydroxyde de fer.",
    reactants: [
      { id: 'r1', formula: 'Fe', composition: { Fe: 1 }, coefficient: 1 },
      { id: 'r2', formula: 'O₂', composition: { O: 2 }, coefficient: 1 },
      { id: 'r3', formula: 'H₂O', composition: { H: 2, O: 1 }, coefficient: 1 },
    ],
    products: [
      { id: 'p1', formula: 'Fe(OH)₃', composition: { Fe: 1, O: 3, H: 3 }, coefficient: 1 },
    ],
  },
];