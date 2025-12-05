import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Module } from '../types';
import { FALLBACK_QUESTIONS } from '../constants';

const apiKey = process.env.API_KEY;

// Define the response schema for the quiz
const quizSchema: Schema = {
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
    required: ["id", "text", "options", "correctAnswerIndex"]
  }
};

export const generateQuizForModule = async (module: Module): Promise<Question[]> => {
  if (!apiKey) {
    console.warn("No API Key found. Using fallback questions.");
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Question[];
      }
      console.warn("Gemini returned valid JSON but not an array of questions.");
    }

    throw new Error("No content generated");

  } catch (error) {
    console.error("Failed to generate quiz with Gemini:", error);
    return FALLBACK_QUESTIONS;
  }
};