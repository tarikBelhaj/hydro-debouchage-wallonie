// Helper functions for Gemini AI integration
import { GoogleGenAI } from "@google/genai";

export const generateCityDescription = async (city: string): Promise<string> => {
  try {
     const apiKey = process.env.API_KEY;
      if (!apiKey) return `Services de débouchage experts à ${city}.`;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Génère une phrase d'accroche courte (max 20 mots) pour un service de plomberie d'urgence à ${city}, Belgique. Mets l'accent sur la rapidité.`,
      });
      return response.text || `Services de débouchage experts à ${city}.`;
  } catch (e) {
    console.log('gemini error:', e);
    return `Services de débouchage experts à ${city}.`;
  }
}
```

**Sauvegarde**

---

### **5-7. Tes fichiers existants**

Maintenant crée ces 3 fichiers et **copie-colle le code que tu m'as envoyé au début** :

- **src/App.tsx** → Ton gros fichier App.tsx
- **src/constants.tsx** → Ton fichier constants.tsx
- **src/components/AIChatAssistant.tsx** → Ton fichier AIChatAssistant
- **src/components/StickyCallBtn.tsx** → Ton fichier StickyCallBtn

---

## ✅ Vérification finale

Voir :
📁 hydro-debouchage-wallonie
├── .env.example
├── .gitignore
├── index.html ✅
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── 📁 src
    ├── App.tsx ✅
    ├── constants.tsx ✅
    ├── index.tsx ✅
    ├── types.ts ✅
    ├── 📁 components
    │   ├── AIChatAssistant.tsx ✅
    │   └── StickyCallBtn.tsx ✅
    └── 📁 services
        └── gemini.ts ✅