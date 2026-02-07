import { GoogleGenAI } from "@google/genai";

export const checkApiKey = async (): Promise<boolean> => {
  if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return false;
};

export const requestApiKey = async () => {
  if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
    await (window as any).aistudio.openSelectKey();
  }
};

export const generateVeoVideo = async (imageBase64: string, prompt: string): Promise<string | null> => {
  try {
    // Create new instance to ensure we pick up the latest key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata header
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/png', // Veo supports common image formats
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API Key for access
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};