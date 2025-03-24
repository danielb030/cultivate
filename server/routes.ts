import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, analyzeTranscript, analyzeTextTranscript } from "./openai";
import multer from "multer";
import { z } from "zod";
import { insertRecordingSchema, updateRecordingSchema } from "@shared/schema";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API routes
  
  // Get all recordings
  app.get("/api/recordings", async (req: Request, res: Response) => {
    try {
      const recordings = await storage.getAllRecordings();
      console.log("getAllRecordings returned:", JSON.stringify(recordings, null, 2));
      res.json(recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  // Get a specific recording
  app.get("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recording ID" });
      }

      const recording = await storage.getRecording(id);
      if (!recording) {
        return res.status(404).json({ message: "Recording not found" });
      }

      res.json(recording);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recording" });
    }
  });

  // Upload a new recording
  app.post("/api/recordings", upload.single("audio"), async (req: Request, res: Response) => {
    try {
      // Parse the request data first
      const parsedData = JSON.parse(req.body.data || "{}");
      
      // Convert ISO date string to Date object if it exists
      if (parsedData.recordedAt && typeof parsedData.recordedAt === 'string') {
        parsedData.recordedAt = new Date(parsedData.recordedAt);
      }
      
      // Make sure all required fields are present
      if (!parsedData.title || parsedData.duration === undefined) {
        return res.status(400).json({ 
          message: "Invalid recording data", 
          errors: ["Title and duration are required"] 
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      // Extract file extension from original filename or mimetype
      let fileExtension = "mp3"; // Default
      
      // Try to get extension from original filename
      if (req.file.originalname) {
        const nameParts = req.file.originalname.split('.');
        if (nameParts.length > 1) {
          fileExtension = nameParts[nameParts.length - 1].toLowerCase();
        }
      }
      
      // If that didn't work, try to get from mimetype
      if (fileExtension === "mp3" && req.file.mimetype) {
        if (req.file.mimetype.includes("wav")) {
          fileExtension = "wav";
        } else if (req.file.mimetype.includes("ogg")) {
          fileExtension = "ogg";
        } else if (req.file.mimetype.includes("webm")) {
          fileExtension = "webm";
        } else if (req.file.mimetype.includes("m4a") || req.file.mimetype.includes("x-m4a")) {
          fileExtension = "m4a";
        } else if (req.file.mimetype.includes("mp4")) {
          fileExtension = "mp4";
        }
      }
      
      // Create a sanitized filename with the original extension
      const sanitizedTitle = parsedData.title.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '-');
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      const filename = `${uniqueId}-${sanitizedTitle}.${fileExtension}`;
      
      console.log(`Saving audio file as ${filename} with mimetype ${req.file.mimetype}`);
      
      // Save the audio file with appropriate extension
      const audioPath = await storage.saveAudioFile(
        filename,
        req.file.buffer
      );

      // Create the recording with the extracted data
      const recordingData = {
        title: parsedData.title,
        duration: parsedData.duration,
        recordedAt: parsedData.recordedAt || new Date(),
        audioPath: audioPath,
        tags: parsedData.tags
      };
      console.log("Creating recording with data:", JSON.stringify(recordingData, null, 2));
      const recording = await storage.createRecording(recordingData);
      console.log("Created recording:", JSON.stringify(recording, null, 2));

      // Process the audio file (transcribe and analyze)
      // This would typically be done asynchronously in a production app
      try {
        // Transcribe the audio with proper content type
        console.log(`Processing file with mimetype: ${req.file.mimetype}`);
        const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
        
        // Update the recording with the transcript
        let updatedRecording = await storage.updateRecording(recording.id, {
          transcript: JSON.stringify(transcript)
        });
        
        // Analyze the transcript
        const analysis = await analyzeTranscript(transcript);
        
        // Update the recording with the analysis
        updatedRecording = await storage.updateRecording(recording.id, {
          analysis
        });
        
        // Return the fully processed recording
        res.status(201).json(updatedRecording);
      } catch (processingError) {
        // If processing fails, still return the created recording
        console.error("Processing error:", processingError);
        res.status(201).json({
          ...recording,
          processingError: "Audio processing failed, but recording was saved"
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recording data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload recording" });
    }
  });

  // Update a recording
  app.patch("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recording ID" });
      }

      // Validate request data
      const updateData = updateRecordingSchema.partial().parse(req.body);

      // Update the recording
      const updatedRecording = await storage.updateRecording(id, updateData);
      if (!updatedRecording) {
        return res.status(404).json({ message: "Recording not found" });
      }

      res.json(updatedRecording);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recording" });
    }
  });

  // Delete a recording
  app.delete("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recording ID" });
      }

      const success = await storage.deleteRecording(id);
      if (!success) {
        return res.status(404).json({ message: "Recording not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recording" });
    }
  });

  // Get audio file
  app.get("/api/audio/:path", async (req: Request, res: Response) => {
    try {
      const audioPath = req.params.path;
      const audioBuffer = await storage.getAudioFile(audioPath);
      
      if (!audioBuffer) {
        return res.status(404).json({ message: "Audio file not found" });
      }
      
      // Determine content type based on file extension
      let contentType = "audio/mpeg"; // Default
      
      if (audioPath.endsWith(".wav") || audioPath.endsWith(".wave")) {
        contentType = "audio/wav";
      } else if (audioPath.endsWith(".ogg")) {
        contentType = "audio/ogg";
      } else if (audioPath.endsWith(".webm")) {
        contentType = "audio/webm";
      } else if (audioPath.endsWith(".flac")) {
        contentType = "audio/flac";
      } else if (audioPath.endsWith(".m4a")) {
        contentType = "audio/m4a";
      } else if (audioPath.endsWith(".mp4")) {
        contentType = "audio/mp4";
      }
      
      console.log(`Serving audio file ${audioPath} with content type ${contentType}`);
      
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve audio file" });
    }
  });

  // Upload a text transcript for analysis
  app.post("/api/text-analysis", async (req: Request, res: Response) => {
    try {
      const { title, text } = req.body;
      
      if (!title || !text) {
        return res.status(400).json({ message: "Title and text are required" });
      }

      // Create a placeholder audio path (since we don't have audio)
      const textId = Date.now().toString();
      const audioPath = `text-${textId}`;
      
      // Create the recording with the current timestamp
      const recording = await storage.createRecording({
        title,
        duration: 0, // No actual duration for text
        audioPath,
        recordedAt: new Date() // Explicitly set the date
      });
      
      try {
        // Analyze the text transcript
        console.log("Analyzing text transcript...");
        const analysis = await analyzeTextTranscript(text);
        console.log("Analysis received:", JSON.stringify(analysis, null, 2).substring(0, 200) + "...");
        
        // Create a simplified transcript object
        const segments = text.split('\n')
          .filter((line: string) => line.trim())
          .map((line: string, index: number) => {
            return {
              id: index + 1,
              speaker: line.toLowerCase().includes("parent") ? "Parent" : "Child",
              text: line,
              start: index,
              end: index + 1
            };
          });
        
        const transcript = {
          text,
          segments
        };
        
        console.log("Updating recording with transcript and analysis...");
        // Update the recording with the transcript and analysis
        const updatedRecording = await storage.updateRecording(recording.id, {
          transcript: JSON.stringify(transcript),
          analysis
        });
        
        console.log("Recording updated successfully, returning to client");
        res.status(201).json(updatedRecording);
      } catch (processingError: any) {
        console.error("Text processing error:", processingError);
        res.status(201).json({
          ...recording,
          processingError: "Text analysis failed, but recording was saved: " + 
            (processingError.message || String(processingError))
        });
      }
    } catch (error) {
      console.error("Text upload error:", error);
      res.status(500).json({ message: "Failed to process text transcript" });
    }
  });

  return httpServer;
}
