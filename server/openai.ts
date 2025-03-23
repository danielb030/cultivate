import OpenAI from "openai";
import { Analysis, Transcript, TranscriptSegment } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Transcribe audio function with improved diarization
export async function transcribeAudio(audioBuffer: Buffer): Promise<Transcript> {
  try {
    // Create a temporary Blob URL for the audio file
    const blob = new Blob([audioBuffer], { type: "audio/mp3" });
    
    // Create a File object from the Blob
    const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
    
    console.log("Starting audio transcription...");
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });
    console.log("Transcription completed successfully");
    
    // Process the transcription to create our transcript format
    const segments: TranscriptSegment[] = [];
    
    if (transcription.segments) {
      // First, try to identify speakers using sentence patterns and context clues
      console.log("Processing transcript segments for speaker identification...");
      
      // Get AI to identify speakers more accurately
      if (transcription.segments.length > 0) {
        const segmentTexts = transcription.segments.map(s => s.text).join("\n");
        
        const speakerResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert in conversation analysis. Identify whether each segment is likely 
              spoken by a "Parent" or "Child" based on language patterns, tone, and context. 
              Respond with a JSON array of the format: [{"index": 0, "speaker": "Parent"}, {"index": 1, "speaker": "Child"}, ...] 
              for each segment in the conversation.`
            },
            {
              role: "user",
              content: `Here is a conversation transcript split into segments. Identify the speaker for each segment:
              ${segmentTexts}`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        const speakerData = JSON.parse(speakerResponse.choices[0].message.content || "{}");
        
        // Apply the identified speakers to our segments
        if (speakerData && Array.isArray(speakerData)) {
          for (let i = 0; i < transcription.segments.length; i++) {
            const segment = transcription.segments[i];
            const speakerInfo = speakerData.find(s => s.index === i);
            const speaker = speakerInfo ? speakerInfo.speaker : (i % 2 === 0 ? "Parent" : "Child");
            
            segments.push({
              id: i + 1,
              speaker: speaker,
              text: segment.text,
              start: segment.start || 0,
              end: segment.end || 0
            });
          }
        } else {
          // Fallback if AI speaker identification fails
          for (let i = 0; i < transcription.segments.length; i++) {
            const segment = transcription.segments[i];
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
      }
    }
    
    console.log(`Transcript processed with ${segments.length} segments`);
    
    return {
      text: transcription.text,
      segments: segments
    };
  } catch (error: any) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe audio: " + (error.message || String(error)));
  }
}

// Advanced ML analysis function with enhanced parenting insights
export async function analyzeTranscript(transcript: Transcript): Promise<Analysis> {
  try {
    console.log("Starting advanced transcript analysis...");
    
    // Prepare the conversation for analysis
    const fullText = transcript.segments.map(s => `${s.speaker}: ${s.text}`).join("\n");
    
    // Perform sentiment analysis
    console.log("Performing comprehensive conversation analysis...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: `You are an expert in family dynamics, child development, and parenting psychology. 
          Analyze this conversation between a parent and child to provide deep insights and evidence-based parenting recommendations.
          
          Think step by step:
          1. Identify key topics and themes in the conversation
          2. Assess the parent's communication style and effectiveness
          3. Evaluate the overall parenting approach using established parenting style frameworks
          4. Analyze the emotional tone and sentiment of both parent and child
          5. Identify specific growth areas for the parent
          6. Consider long-term developmental impacts on the child
          7. Provide actionable, specific recommendations
          
          Respond in JSON format with the following structure:
          {
            "topics": [{"name": string, "percentage": number}], // Top 5 topics discussed, with percentages that add up to 100
            
            "communicationStyle": {
              "openEndedQuestions": number, // 0-100 score
              "activeListening": number, // 0-100 score
              "emotionalSupport": number, // 0-100 score
              "patientResponse": number, // 0-100 score
              "positiveReinforcement": number // 0-100 score
            },
            
            "parentingStyle": {
              "authoritative": number, // 0-100 score (balanced, warm but firm)
              "permissive": number, // 0-100 score (lenient, few boundaries)
              "authoritarian": number, // 0-100 score (strict, many rules)
              "uninvolved": number // 0-100 score (detached, minimal engagement)
            },
            
            "sentimentAnalysis": {
              "parent": {
                "positive": number, // 0-100 percentage
                "neutral": number, // 0-100 percentage
                "negative": number // 0-100 percentage
              },
              "child": {
                "positive": number, // 0-100 percentage
                "neutral": number, // 0-100 percentage
                "negative": number // 0-100 percentage
              }
            },
            
            "growthAreas": [
              {
                "area": string, // Name of improvement area
                "description": string, // Detailed explanation
                "priority": "High" | "Medium" | "Low",
                "suggestedResources": [string] // 1-3 book titles, websites, or courses
              }
            ], // 1-3 areas for improvement
            
            "suggestions": [string], // 3-5 actionable, specific suggestions for the parent
            
            "longTermImpacts": [string], // 2-3 potential long-term effects on child development
            
            "summary": string, // Brief summary of the positive aspects of the interaction
            
            "tags": [string], // 3-5 tags that categorize the conversation
            
            "developmentalInsights": {
              "ageAppropriate": boolean, // Is the parent's approach age-appropriate?
              "cognitiveStimulation": number, // 0-100 score
              "emotionalDevelopment": number, // 0-100 score
              "keyMilestones": [string] // 0-3 developmental milestones relevant to this interaction
            }
          }`
        },
        {
          role: "user",
          content: fullText
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });
    
    console.log("Analysis completed, processing results...");
    const analysisResult = JSON.parse(response.choices[0].message.content || "{}");
    
    // Create the enhanced analysis object with defaults for any missing fields
    return {
      topics: analysisResult.topics || [],
      communicationStyle: {
        openEndedQuestions: analysisResult.communicationStyle?.openEndedQuestions || 0,
        activeListening: analysisResult.communicationStyle?.activeListening || 0,
        emotionalSupport: analysisResult.communicationStyle?.emotionalSupport || 0,
        patientResponse: analysisResult.communicationStyle?.patientResponse || 0,
        positiveReinforcement: analysisResult.communicationStyle?.positiveReinforcement || 0
      },
      parentingStyle: analysisResult.parentingStyle || {
        authoritative: 0,
        permissive: 0,
        authoritarian: 0,
        uninvolved: 0
      },
      sentimentAnalysis: analysisResult.sentimentAnalysis || {
        parent: { positive: 0, neutral: 0, negative: 0 },
        child: { positive: 0, neutral: 0, negative: 0 }
      },
      growthAreas: analysisResult.growthAreas || [],
      suggestions: analysisResult.suggestions || [],
      longTermImpacts: analysisResult.longTermImpacts || [],
      summary: analysisResult.summary || "",
      tags: analysisResult.tags || [],
      developmentalInsights: analysisResult.developmentalInsights
    };
  } catch (error: any) {
    console.error("Analysis error:", error);
    throw new Error("Failed to analyze transcript: " + (error.message || String(error)));
  }
}

// Analyze text transcript (for direct text input)
export async function analyzeTextTranscript(text: string): Promise<Analysis> {
  try {
    console.log("Starting text-based analysis...");
    
    // First, use AI to structure the raw text into a proper transcript with speakers
    const structureResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in conversation analysis. Given a text that represents a conversation 
          between a parent and child, structure it into a proper transcript format with speakers labeled as 
          "Parent" or "Child". If the speaker isn't clear, make your best determination based on context.
          
          Respond with a JSON array of segments in the format:
          {
            "segments": [
              {"speaker": "Parent", "text": "..."},
              {"speaker": "Child", "text": "..."},
              ...
            ]
          }`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const structuredText = JSON.parse(structureResponse.choices[0].message.content || "{}");
    
    // Convert the structured text to our transcript format
    const segments: TranscriptSegment[] = [];
    
    if (structuredText.segments) {
      for (let i = 0; i < structuredText.segments.length; i++) {
        const segment = structuredText.segments[i];
        segments.push({
          id: i + 1,
          speaker: segment.speaker,
          text: segment.text,
          start: i, // Placeholder values since this is a text transcript
          end: i + 1
        });
      }
    }
    
    const transcript: Transcript = {
      text: text,
      segments: segments
    };
    
    // Use our regular analysis function now that we have a structured transcript
    return await analyzeTranscript(transcript);
  } catch (error: any) {
    console.error("Text analysis error:", error);
    throw new Error("Failed to analyze text: " + (error.message || String(error)));
  }
}
