
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { EditSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation failed, no images were returned.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check your prompt or API key.");
    }
};

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
};

export const describeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(imageBase64, mimeType);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: "Describe this image in detail." }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error describing image:", error);
        throw new Error("Failed to get image description.");
    }
};

export const suggestEdits = async (imageBase64: string, mimeType: string): Promise<EditSuggestion[]> => {
    try {
        const imagePart = fileToGenerativePart(imageBase64, mimeType);
        const prompt = "Suggest 3 creative and detailed edits for this photo. Examples: change background, add elements, or apply a specific artistic style. Provide the suggestions as a JSON array of objects, each with a 'title' and 'description' key.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'A short, catchy title for the edit suggestion.'
                            },
                            description: {
                                type: Type.STRING,
                                description: 'A detailed description of the suggested edit, which can be used as a prompt for image editing.'
                            }
                        },
                        required: ["title", "description"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString);
        return suggestions;

    } catch (error) {
        console.error("Error suggesting edits:", error);
        throw new Error("Failed to get edit suggestions.");
    }
};

export const generateStory = async (imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(imageBase64, mimeType);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, { text: "Write a short, imaginative story based on this image." }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to generate a story from the image.");
    }
};


export const editImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(imageBase64, mimeType);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("Image editing failed, no image data was returned.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to apply the edit to the image.");
    }
};
