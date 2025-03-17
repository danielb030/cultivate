import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, analyzeTranscript } from "./openai";
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
      res.json(recordings);
    } catch (error) {
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
      // Validate request data
      const recordingData = insertRecordingSchema.parse(JSON.parse(req.body.data || "{}"));

      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      // Save the audio file
      const audioPath = await storage.saveAudioFile(
        req.file.originalname,
        req.file.buffer
      );

      // Create the recording
      const recording = await storage.createRecording({
        ...recordingData,
        audioPath
      });

      // Process the audio file (transcribe and analyze)
      // This would typically be done asynchronously in a production app
      try {
        // Transcribe the audio
        const transcript = await transcribeAudio(req.file.buffer);
        
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
      
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve audio file" });
    }
  });

  return httpServer;
}
