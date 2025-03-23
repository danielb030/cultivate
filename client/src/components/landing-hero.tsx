import { useState } from "react";
import { Mic, Upload, MessageSquare, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadAudio } from "@/components/ui/upload-audio";
import { UploadText } from "@/components/ui/upload-text";
import { Recorder } from "@/components/ui/recorder";

interface LandingHeroProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onAudioUpload: (file: File, title: string, description?: string) => Promise<void>;
  onTextUpload: (title: string, text: string) => Promise<void>;
  isUploading: boolean;
}

export function LandingHero({ 
  onRecordingComplete, 
  onAudioUpload,
  onTextUpload,
  isUploading 
}: LandingHeroProps) {
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");

  const handleSubmitQuestion = async () => {
    // In a real implementation, this would send the question to the backend
    console.log("Question submitted:", { title: questionTitle, question: questionText });
    setAskQuestionOpen(false);
    setQuestionTitle("");
    setQuestionText("");
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Improve your</span>{" "}
                <span className="block text-primary-600">parenting journey</span>
              </h1>
              <h2 className="mt-2 text-2xl font-bold text-gray-700">
                <span className="block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Decode Everyday Moments. Establish Permanent Legacy.
                </span>
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Upload family conversations, receive transcriptions, and get personalized insights to enhance your parenting skills. Learn from every interaction to build a lasting legacy.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button 
                    className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                    onClick={() => setAskQuestionOpen(true)}
                  >
                    <FileQuestion className="mr-2 h-5 w-5" />
                    Ask a Question
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
        <div className="h-full flex items-center justify-center p-6">
          <Tabs defaultValue="record" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="record">Record</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="record" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Record a Conversation</CardTitle>
                  <CardDescription>
                    Capture family moments in real-time for immediate insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Recorder onRecordingComplete={onRecordingComplete} />
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Record interactions with your children to gain insights on improving communication.
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Media or Text</CardTitle>
                  <CardDescription>
                    Analyze pre-recorded family conversations or written transcripts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="audio">
                    <TabsList className="mb-4 grid w-full grid-cols-3">
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="text">Text</TabsTrigger>
                    </TabsList>
                    <TabsContent value="audio">
                      <UploadAudio onUpload={onAudioUpload} isUploading={isUploading} />
                    </TabsContent>
                    <TabsContent value="video">
                      <div className="p-4 border-2 border-dashed rounded-md border-gray-300 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 text-gray-400">
                          <path d="M17 5c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.5.8 2H11c-1.7 0-3 1.3-3 3v1" />
                          <path d="M13 22H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
                          <path d="m18 22 4-4" />
                          <path d="m15 19 7 0" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                          Coming soon! Video upload will be available in a future update.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="text">
                      <UploadText onUpload={onTextUpload} isUploading={isUploading} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Upload existing conversations in multiple formats to receive personalized parenting insights.
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="folders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Organize Your Insights</CardTitle>
                  <CardDescription>
                    Keep your parenting journey organized.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <span className="w-8">📁</span> Recent Conversations
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="w-8">📁</span> Growth Moments
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="w-8">📁</span> Conflict Resolution
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="w-8">📁</span> Positive Reinforcement
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-primary-600">
                      <span className="w-8">➕</span> Create New Folder
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Categorize your recordings to track progress in specific areas.
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Ask Question Dialog */}
      <Dialog open={askQuestionOpen} onOpenChange={setAskQuestionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask Your Parenting Question</DialogTitle>
            <DialogDescription>
              Get personalized guidance for your specific parenting challenges.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Topic</Label>
              <Input
                id="title"
                placeholder="e.g., Handling Tantrums, Screen Time Limits"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                placeholder="Describe your situation and what you'd like guidance on..."
                rows={5}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setAskQuestionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitQuestion} disabled={!questionTitle || !questionText}>
              Submit Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}