import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const recordings = pgTable("recordings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  duration: integer("duration").notNull(), // in seconds
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  audioPath: text("audio_path").notNull(),
  transcript: text("transcript"),
  analysis: jsonb("analysis"),
  tags: text("tags").array(),
});

export const insertRecordingSchema = createInsertSchema(recordings).omit({
  id: true,
  transcript: true,
  analysis: true,
});

export const updateRecordingSchema = createInsertSchema(recordings).omit({
  id: true,
  audioPath: true,
});

export type InsertRecording = z.infer<typeof insertRecordingSchema>;
export type UpdateRecording = z.infer<typeof updateRecordingSchema>;
export type Recording = typeof recordings.$inferSelect;

export type Transcript = {
  text: string;
  segments: TranscriptSegment[];
};

export type TranscriptSegment = {
  id: number;
  speaker: string;
  text: string;
  start: number;
  end: number;
};

export type Analysis = {
  topics: { name: string; percentage: number }[];
  communicationStyle: { 
    openEndedQuestions: number;
    activeListening: number;
    emotionalSupport: number;
  };
  growthAreas: { 
    area: string;
    description: string;
    priority: "High" | "Medium" | "Low";
  }[];
  suggestions: string[];
  summary: string;
  tags: string[];
};
