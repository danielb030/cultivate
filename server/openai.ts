import OpenAI from "openai";
import { Analysis, Transcript, TranscriptSegment } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-api-key" });

// Transcribe audio function
export async function transcribeAudio(audioBuffer: Buffer): Promise<Transcript> {
  try {
    // Create a temporary Blob URL for the audio file
    const blob = new Blob([audioBuffer], { type: "audio/mp3" });
    
    // Create a File object from the Blob
    const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });
    
    // Process the transcription to create our transcript format
    const segments: TranscriptSegment[] = [];
    
    if (transcription.segments) {
      for (let i = 0; i < transcription.segments.length; i++) {
        const segment = transcription.segments[i];
        
        // Try to determine if this is a parent or child speaking
        // This is a simplified approach - in a real app, you would use a more sophisticated speaker diarization
        const speaker = i % 2 === 0 ? "Parent" : "Child";
        
        segments.push({
          id: i + 1,
          speaker: speaker,
          text: segment.text,
          start: segment.start || 0,
          end: segment.end || 0
        });
      }
    }
    
    return {
      text: transcription.text,
      segments: segments
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe audio: " + error.message);
  }
}

// Analyze transcript function
export async function analyzeTranscript(transcript: Transcript): Promise<Analysis> {
  try {
    // Prepare the prompt for analysis
    const fullText = transcript.segments.map(s => `${s.speaker}: ${s.text}`).join("\n");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: `You are an expert in family dynamics and child development. 
          Analyze this conversation between a parent and child to provide insights and helpful parenting tips.
          Respond in JSON format with the following structure:
          {
            "topics": [{"name": string, "percentage": number}], // Top 5 topics discussed, with percentages that add up to 100
            "communicationStyle": {"openEndedQuestions": number, "activeListening": number, "emotionalSupport": number}, // Scores from 0-100
            "growthAreas": [{"area": string, "description": string, "priority": "High" | "Medium" | "Low"}], // 1-3 areas for improvement
            "suggestions": [string], // 3 actionable suggestions for the parent
            "summary": string, // Brief summary of the positive aspects of the interaction
            "tags": [string] // 3 tags that categorize the conversation
          }`
        },
        {
          role: "user",
          content: fullText
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const analysisResult = JSON.parse(response.choices[0].message.content);
    
    return {
      topics: analysisResult.topics || [],
      communicationStyle: analysisResult.communicationStyle || {
        openEndedQuestions: 0,
        activeListening: 0,
        emotionalSupport: 0
      },
      growthAreas: analysisResult.growthAreas || [],
      suggestions: analysisResult.suggestions || [],
      summary: analysisResult.summary || "",
      tags: analysisResult.tags || []
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error("Failed to analyze transcript: " + error.message);
  }
}
