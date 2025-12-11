import { GoogleGenAI } from "@google/genai";
import { MarketingAngle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to construct a winning prompt based on the angle
const constructPrompt = (product: string, angle: MarketingAngle): string => {
  const basePrompt = `Professional product photography of ${product}.`;
  
  switch (angle) {
    case MarketingAngle.LUXURY:
      return `${basePrompt} High-end luxury aesthetic, dark moody background or marble textures, gold accents, dramatic studio lighting, sharp focus, 8k resolution, award-winning photography, evoking authority and exclusivity.`;
    case MarketingAngle.URGENCY:
      return `${basePrompt} Bold and vibrant colors, dynamic composition, bright lighting, high contrast, red or orange accents implies urgency, "Sale" aesthetic but premium, popping out of the screen, 4k advertising style.`;
    case MarketingAngle.LIFESTYLE:
      return `${basePrompt} Real-life context usage, soft natural lighting (golden hour), beautiful blurred background (bokeh), evoking desire and happiness, modern social media influencer aesthetic, highly detailed.`;
    case MarketingAngle.MINIMALIST:
      return `${basePrompt} Ultra-clean solid pastel background, geometric composition, ample whitespace, sharp shadows, modern art direction, evoking curiosity, focus entirely on the product details, apple-style advertisement.`;
    default:
      return `${basePrompt} Professional advertising photo, studio lighting, 4k.`;
  }
};

export const generateCreativeImage = async (productDescription: string, angle: MarketingAngle): Promise<string> => {
  try {
    const prompt = constructPrompt(productDescription, angle);
    
    // Using gemini-2.5-flash-image for speed and efficiency as per instructions for general generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Square for Facebook Ads
        }
      }
    });

    // Extract the image from the response
    // The response structure needs to be traversed to find the inlineData
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating creative:", error);
    throw error;
  }
};