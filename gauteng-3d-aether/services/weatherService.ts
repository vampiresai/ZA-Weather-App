import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

// Takes the AI's response text and extracts the structured weather data we need
const parseWeatherData = (text: string, sources: { uri: string; title: string }[]): WeatherData => {
  // Pull out the specific fields from the formatted response
  const tempMatch = text.match(/TEMP:\s*(.+)/i);
  const condMatch = text.match(/CONDITION:\s*(.+)/i);
  const categoryMatch = text.match(/CATEGORY:\s*(.+)/i);
  const humMatch = text.match(/HUMIDITY:\s*(.+)/i);
  const windMatch = text.match(/WIND:\s*(.+)/i);

  // Clean up the description by removing the structured data lines
  // This leaves us with just the witty summary the AI provided
  const description = text
    .replace(/TEMP:.+/i, '')
    .replace(/CONDITION:.+/i, '')
    .replace(/CATEGORY:.+/i, '')
    .replace(/HUMIDITY:.+/i, '')
    .replace(/WIND:.+/i, '')
    .trim();

  let normalizedCondition = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'clear';
  
  return {
    temperature: tempMatch ? tempMatch[1].trim() : "--",
    condition: condMatch ? condMatch[1].trim() : "Unknown",
    humidity: humMatch ? humMatch[1].trim() : "--",
    windSpeed: windMatch ? windMatch[1].trim() : "--",
    description: description || "Current weather details for Gauteng.",
    sources: sources,
  };
};

// Fetches current weather data for Gauteng using Google Gemini with web search
export const fetchWeather = async (): Promise<WeatherData> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    
    // Ask Gemini to search for current weather and format the response in a specific way
    const prompt = `
      Search for the current live weather in Gauteng, South Africa, preferably using AccuWeather data.
      
      First, provide a very short, witty 1-sentence summary of the weather.
      
      Then, strictly at the end, provide data in this format:
      TEMP: [Temperature e.g. 24°]
      CONDITION: [Short text e.g. Partly Cloudy]
      HUMIDITY: [e.g. 40%]
      WIND: [e.g. 15 km/h]
      
      IMPORTANT: ensure the CONDITION text contains one of these keywords if applicable: Clear, Sunny, Cloud, Overcast, Rain, Drizzle, Storm, Thunder, Snow.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract the source URLs from the search results so we can show where the data came from
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return parseWeatherData(text, sources);

  } catch (error) {
    console.error("Failed to fetch weather:", error);
    throw error;
  }
};