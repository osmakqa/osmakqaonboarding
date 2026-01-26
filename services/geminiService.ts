import { GoogleGenAI, Type } from "@google/genai";
import { Question, Module } from '../types';
import { FALLBACK_QUESTIONS } from '../constants';

/**
 * Generates a quiz for a training module using Google Gemini.
 * Adheres strictly to @google/genai guidelines.
 */
export const generateQuizForModule = async (module: Module): Promise<Question[]> => {
  // Directly assume process.env.API_KEY is available as per requirements
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found in environment. Using fallback questions.");
    return FALLBACK_QUESTIONS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Create a multiple-choice quiz with 5 difficult questions for a hospital quality assurance training module.
      
      Module Title: ${module.title}
      Module Description: ${module.description}
      Key Topics: ${module.topics.join(', ')}
      
      The target audience is medical professionals. The questions should test comprehension of safety protocols and quality standards.
      Ensure there is exactly one correct answer per question.
    `;

    // Using gemini-3-pro-preview for complex reasoning tasks like quiz generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING, description: "The question text" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "A list of 4 possible answers"
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The index (0-3) of the correct answer in the options array" 
              }
            },
            propertyOrdering: ["id", "text", "options", "correctAnswerIndex"],
            required: ["id", "text", "options", "correctAnswerIndex"]
          }
        },
        temperature: 0.3,
      }
    });

    // Directly access .text property as per guidelines
    const responseText = response.text;
    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Question[];
      }
    }

    throw new Error("Invalid or empty response from Gemini");

  } catch (error: any) {
    console.error("Failed to generate quiz with Gemini:", error?.message || error);
    return FALLBACK_QUESTIONS;
  }
};