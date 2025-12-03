export type ElementSymbol = 'H' | 'C' | 'O' | 'N' | 'Cl' | 'Na' | 'Mg' | 'S' | 'Fe' | 'Cu' | 'Zn' | 'Al';

export interface AtomComposition {
  [key: string]: number; // e.g., { H: 2, O: 1 } for H2O
}

export interface ChemicalComponent {
  id: string;
  formula: string; // Display string, e.g., "H₂O"
  composition: AtomComposition;
  coefficient: number; // The user-adjustable number
}

export interface LevelData {
  id: string;
  name: string;
  reactants: ChemicalComponent[];
  products: ChemicalComponent[];
  description: string; // Fun fact or context
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

export interface ElementColor {
  bg: string;
  border: string;
  text: string;
}

export interface GameState {
  currentLevelIndex: number;
  score: number;
  levels: LevelData[];
  isLevelComplete: boolean;
  loading: boolean;
}