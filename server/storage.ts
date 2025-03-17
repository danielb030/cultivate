import { recordings, type Recording, type InsertRecording, type UpdateRecording, type Transcript, type Analysis } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recording methods
  getAllRecordings(): Promise<Recording[]>;
  getRecording(id: number): Promise<Recording | undefined>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  updateRecording(id: number, recording: Partial<UpdateRecording>): Promise<Recording | undefined>;
  deleteRecording(id: number): Promise<boolean>;
  
  // File storage methods
  saveAudioFile(fileName: string, buffer: Buffer): Promise<string>;
  getAudioFile(path: string): Promise<Buffer | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recordings: Map<number, Recording>;
  private audioFiles: Map<string, Buffer>;
  private userCurrentId: number;
  private recordingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.recordings = new Map();
    this.audioFiles = new Map();
    this.userCurrentId = 1;
    this.recordingCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample recording 1
    const recording1: Recording = {
      id: this.recordingCurrentId++,
      title: "Dinner Conversation about School Day",
      duration: 720, // 12 minutes
      recordedAt: new Date("2023-05-15T19:42:00"),
      audioPath: "sample-audio-1.mp3",
      transcript: JSON.stringify({
        text: "Full conversation transcript",
        segments: [
          {
            id: 1,
            speaker: "Parent",
            text: "How was school today? Did anything exciting happen?",
            start: 0,
            end: 5
          },
          {
            id: 2,
            speaker: "Child",
            text: "It was okay. We had an assembly about the science fair. I'm thinking about doing a project on plants.",
            start: 5,
            end: 12
          },
          {
            id: 3,
            speaker: "Parent",
            text: "That sounds interesting! What kind of plant project are you thinking about?",
            start: 12,
            end: 17
          }
        ]
      }),
      analysis: {
        topics: [
          { name: "School", percentage: 85 },
          { name: "Science", percentage: 65 },
          { name: "Projects", percentage: 40 }
        ],
        communicationStyle: {
          openEndedQuestions: 82,
          activeListening: 75,
          emotionalSupport: 65
        },
        growthAreas: [
          {
            area: "Follow up on interests",
            description: "Support child's interests by exploring the topic further",
            priority: "Medium"
          }
        ],
        suggestions: [
          "Follow up by exploring plant experiments you could do together at home",
          "Share your own excitement about learning new things",
          "Consider visiting a botanical garden or plant nursery this weekend"
        ],
        summary: "Great job using open-ended questions! Your child showed interest in science. This is an opportunity to encourage curiosity and support a growth mindset.",
        tags: ["Positive Interaction", "Curiosity", "Science Interest"]
      },
      tags: ["school", "science", "positive"]
    };
    
    // Sample recording 2
    const recording2: Recording = {
      id: this.recordingCurrentId++,
      title: "Bedtime Chat about Friendship Challenges",
      duration: 900, // 15 minutes
      recordedAt: new Date("2023-05-12T20:30:00"),
      audioPath: "sample-audio-2.mp3",
      transcript: JSON.stringify({
        text: "Full conversation about friendship challenges",
        segments: [
          {
            id: 1,
            speaker: "Child",
            text: "Alex wouldn't play with me at recess today. I don't think they like me anymore.",
            start: 0,
            end: 7
          },
          {
            id: 2,
            speaker: "Parent",
            text: "That sounds hard. How did that make you feel?",
            start: 7,
            end: 11
          },
          {
            id: 3,
            speaker: "Child",
            text: "Sad. And kind of mad too. We're supposed to be best friends.",
            start: 11,
            end: 16
          }
        ]
      }),
      analysis: {
        topics: [
          { name: "Friends", percentage: 90 },
          { name: "Emotions", percentage: 75 },
          { name: "School", percentage: 30 }
        ],
        communicationStyle: {
          openEndedQuestions: 85,
          activeListening: 95,
          emotionalSupport: 91
        },
        growthAreas: [
          {
            area: "Friendship skills",
            description: "Help develop strategies for navigating friendship challenges",
            priority: "Medium"
          }
        ],
        suggestions: [
          "Help your child understand that friends sometimes need space",
          "Role-play ways to respectfully ask why a friend might not want to play",
          "Encourage developing multiple friendships to build resilience"
        ],
        summary: "Excellent emotional support! You validated your child's feelings and created a safe space for them to express emotions. You're helping develop emotional intelligence.",
        tags: ["Emotional Support", "Friendship Challenges", "Active Listening"]
      },
      tags: ["friendship", "emotions", "support"]
    };
    
    this.recordings.set(recording1.id, recording1);
    this.recordings.set(recording2.id, recording2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRecordings(): Promise<Recording[]> {
    return Array.from(this.recordings.values()).sort((a, b) => 
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
  }

  async getRecording(id: number): Promise<Recording | undefined> {
    return this.recordings.get(id);
  }

  async createRecording(recording: InsertRecording): Promise<Recording> {
    const id = this.recordingCurrentId++;
    const newRecording: Recording = { 
      ...recording, 
      id,
      transcript: null,
      analysis: null
    };
    
    this.recordings.set(id, newRecording);
    return newRecording;
  }

  async updateRecording(id: number, recording: Partial<UpdateRecording>): Promise<Recording | undefined> {
    const existingRecording = this.recordings.get(id);
    
    if (!existingRecording) {
      return undefined;
    }
    
    const updatedRecording = {
      ...existingRecording,
      ...recording
    };
    
    this.recordings.set(id, updatedRecording);
    return updatedRecording;
  }

  async deleteRecording(id: number): Promise<boolean> {
    return this.recordings.delete(id);
  }

  async saveAudioFile(fileName: string, buffer: Buffer): Promise<string> {
    // Generate a unique path for the audio file
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const uniqueFileName = `${hash}-${fileName}`;
    
    // Store the buffer in memory
    this.audioFiles.set(uniqueFileName, buffer);
    
    return uniqueFileName;
  }

  async getAudioFile(path: string): Promise<Buffer | undefined> {
    return this.audioFiles.get(path);
  }
}

export const storage = new MemStorage();
