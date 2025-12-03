import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LevelData } from "../types";

const SYSTEM_INSTRUCTION = `
Tu es un professeur de chimie expert pour le collège (élèves de 12-15 ans).
Ta mission est de générer des équations chimiques non équilibrées pour un jeu éducatif.
Les équations doivent être scientifiquement correctes.
Le JSON doit être strictement formaté pour être analysé par l'application.
Utilise des molécules variées.
Pour les niveaux "Difficile", n'hésite pas à proposer des réactions avec 3 réactifs ou 2 produits complexes.
La composition atomique doit être exacte (ex: O2 -> {O: 2}).
Ne donne jamais les coefficients équilibrés, initialise-les toujours à 1.
`;

const levelSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Nom créatif de la réaction" },
    description: { type: Type.STRING, description: "Fait intéressant en français sur cette réaction (max 2 phrases)" },
    difficulty: { type: Type.STRING, enum: ["Facile", "Moyen", "Difficile"] },
    reactants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          formula: { type: Type.STRING, description: "Formule chimique avec chiffres en indice unicode si possible ou normal (ex: CO₂)" },
          composition: {
            type: Type.OBJECT,
            description: "Map of Element Symbol to Count (ex: {'C': 1, 'O': 2})",
            properties: {
                H: { type: Type.INTEGER, nullable: true},
                C: { type: Type.INTEGER, nullable: true},
                O: { type: Type.INTEGER, nullable: true},
                N: { type: Type.INTEGER, nullable: true},
                Cl: { type: Type.INTEGER, nullable: true},
                Na: { type: Type.INTEGER, nullable: true},
                Mg: { type: Type.INTEGER, nullable: true},
                S: { type: Type.INTEGER, nullable: true},
                Fe: { type: Type.INTEGER, nullable: true},
                Al: { type: Type.INTEGER, nullable: true},
            }
          }
        },
        required: ["formula", "composition"]
      }
    },
    products: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          formula: { type: Type.STRING },
          composition: {
            type: Type.OBJECT,
            properties: {
                H: { type: Type.INTEGER, nullable: true},
                C: { type: Type.INTEGER, nullable: true},
                O: { type: Type.INTEGER, nullable: true},
                N: { type: Type.INTEGER, nullable: true},
                Cl: { type: Type.INTEGER, nullable: true},
                Na: { type: Type.INTEGER, nullable: true},
                Mg: { type: Type.INTEGER, nullable: true},
                S: { type: Type.INTEGER, nullable: true},
                Fe: { type: Type.INTEGER, nullable: true},
                Al: { type: Type.INTEGER, nullable: true},
            }
          }
        },
        required: ["formula", "composition"]
      }
    }
  },
  required: ["name", "description", "difficulty", "reactants", "products"]
};

export const generateNewLevel = async (previousLevelNames: string[]): Promise<LevelData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key available for Gemini.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Génère une nouvelle équation chimique équilibrable différente de celles-ci : ${previousLevelNames.join(', ')}. 
    Pour varier la difficulté, tu peux utiliser jusqu'à 3 réactifs (A + B + C -> D) ou plusieurs produits.
    Exemples complexes appréciés : photosynthèse, réactions d'oxydoréduction avec fer ou cuivre.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: levelSchema,
        temperature: 0.8
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    // Transform raw data to match our internal Types (adding IDs and default coefficients)
    const newLevel: LevelData = {
      id: `gen_${Date.now()}`,
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      reactants: data.reactants.map((r: any, idx: number) => ({
        id: `r_${idx}_${Date.now()}`,
        formula: r.formula,
        composition: r.composition,
        coefficient: 1
      })),
      products: data.products.map((p: any, idx: number) => ({
        id: `p_${idx}_${Date.now()}`,
        formula: p.formula,
        composition: p.composition,
        coefficient: 1
      }))
    };

    return newLevel;

  } catch (error) {
    console.error("Failed to generate level:", error);
    return null;
  }
};

export const getTutorHelp = async (level: LevelData): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return "Je ne peux pas t'aider sans clé API, désolé !";

        const ai = new GoogleGenAI({ apiKey });
        const eqStr = `${level.reactants.map(r => r.formula).join(' + ')} -> ${level.products.map(p => p.formula).join(' + ')}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Donne un indice pédagogique court et encourageant pour aider un élève à équilibrer cette équation : ${eqStr}. Ne donne pas la réponse directe. Explique quelle atome regarder en premier.`,
        });
        
        return response.text || "Essaie de compter les atomes de chaque couleur !";
    } catch (e) {
        return "Concentre-toi sur l'élément le plus complexe d'abord.";
    }
}