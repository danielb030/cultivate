import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PlusCircle, Cloud, MoreHorizontal, Share2, Edit, Trash2, ChevronDown, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getAudioDuration } from "@/lib/audio-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Recorder } from "@/components/ui/recorder";
import { UploadAudio } from "@/components/ui/upload-audio";
import { LandingHero } from "@/components/landing-hero";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Dashboard() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch recordings (for functionality only)
  const { data: recordings = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ["/api/recordings"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Upload recording mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const formData = new FormData();
      
      // Calculate duration in seconds (estimate based on audio file size for now)
      // In a real app, we would use the Web Audio API to get the precise duration
      const durationEstimate = Math.round(file.size / 16000); // Rough estimate
      
      const recordingData = {
        title,
        duration: durationEstimate,
        recordedAt: new Date().toISOString(),
      };
      
      formData.append("audio", file);
      formData.append("data", JSON.stringify(recordingData));
      
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload recording");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
      toast({
        title: "Recording uploaded",
        description: "Your recording has been uploaded and is being processed.",
      });
      setUploadDialogOpen(false);
      setRecordDialogOpen(false);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your recording. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Text transcript upload mutation
  const textUploadMutation = useMutation({
    mutationFn: async ({ title, text }: { title: string; text: string }) => {
      const response = await fetch("/api/text-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to process text transcript");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
      toast({
        title: "Transcript analyzed",
        description: "Your conversation transcript has been analyzed successfully.",
      });
    },
    onError: (error) => {
      console.error("Text analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your transcript. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete recording mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/recordings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
      toast({
        title: "Recording deleted",
        description: "Your recording has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your recording. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (file: File, title: string) => {
    uploadMutation.mutate({ file, title });
  };
  
  const handleTextUpload = async (title: string, text: string) => {
    textUploadMutation.mutate({ title, text });
  };

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    setRecordingBlob(audioBlob);
    setRecordingDuration(duration);
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    
    setRecordingTitle(`Family Session ${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`);
    setRecordDialogOpen(false);
    // The recording dialog will appear automatically since recordingBlob is not null
  };

  const handleSaveRecording = () => {
    if (recordingBlob && recordingTitle) {
      // Get appropriate file extension based on blob type
      let fileExtension = "mp3"; // default
      let normalizedContentType = recordingBlob.type;
      
      // Map content types to extensions
      if (normalizedContentType.includes("wav")) {
        fileExtension = "wav";
      } else if (normalizedContentType.includes("ogg")) {
        fileExtension = "ogg";
      } else if (normalizedContentType.includes("webm")) {
        fileExtension = "webm";
      } else if (normalizedContentType.includes("m4a") || normalizedContentType.includes("x-m4a")) {
        fileExtension = "m4a";
        normalizedContentType = "audio/m4a"; // Normalize content type
      } else if (normalizedContentType.includes("mp4")) {
        fileExtension = "mp4";
      }
      
      console.log(`Creating file with extension .${fileExtension} and type ${normalizedContentType}`);
      
      // Create a File object from the Blob with proper type
      const file = new File(
        [recordingBlob], 
        `${recordingTitle.replace(/[^\w\s.-]/g, '')}.${fileExtension}`, 
        { type: normalizedContentType }
      );
      
      uploadMutation.mutate({ file, title: recordingTitle });
    }
  };

  return (
    <div>
      {/* Main Action Buttons */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Be Better. Pursue Better. Excellence as the standard.
          </h2>
          <p className="mt-2 text-xl text-primary-600 font-semibold">
            Establish Permanent Legacy
          </p>
          <p className="mt-6 text-lg text-gray-500">
            Capture, analyze, and enhance family Sessions. Get personalized insights to strengthen your parent-child relationships.
          </p>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Question Button */}
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Ask a Question | Upload a Session</h3>
                <p className="mt-2 text-base text-gray-500">
                  Be Better. Pursue Better. Establish Excellence as the standard for your family communications.
                </p>
                <Button 
                  className="mt-6 w-full"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Ask a Question | Upload a Session
                </Button>
              </div>
            </div>
            
            {/* Session Button */}
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Record a Session</h3>
                <p className="mt-2 text-base text-gray-500">
                  Be Better. Pursue Better. Excellence as the standard. Establish Permanent Legacy through every conversation.
                </p>
                <Button 
                  className="mt-6 w-full"
                  onClick={() => setRecordDialogOpen(true)}
                >
                  Start Session
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <Link 
              href="/recordings" 
              className="inline-flex items-center text-base font-medium text-primary-600 hover:text-primary-700"
            >
              View Previous Recordings
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <div className="mt-12 text-center">
              <blockquote className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 max-w-2xl mx-auto rounded-lg">
                <p className="text-lg text-amber-900 font-medium italic leading-relaxed">
                  "Instead of buying your children all the things you never had, you should teach them all the things you were never taught."
                </p>
                <footer className="mt-3 text-sm text-amber-700 font-medium">— Bruce Lee</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Ask a Question | Upload a Session Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask a Question | Upload a Session</DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Be Better. Pursue Better. Excellence as the standard for your family life.
            </p>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Tab interface for Ask Question or Upload Recording */}
            <div className="border-b border-gray-200">
              <div className="flex -mb-px space-x-8">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    !showUploadOption ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowUploadOption(false)}
                >
                  Ask a Question
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    showUploadOption ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowUploadOption(true)}
                >
                  Upload a Session
                </button>
              </div>
            </div>

            {!showUploadOption ? (
              <>
                <div className="grid gap-2">
                  <label htmlFor="question-title" className="text-sm font-medium">
                    Question Title
                  </label>
                  <input
                    id="question-title"
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="E.g., 'How to discuss screen time limits'"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="question-details" className="text-sm font-medium">
                    Question Details
                  </label>
                  <textarea
                    id="question-details"
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your situation and what you need help with. Include your child's age and relevant context."
                  ></textarea>
                </div>
                
                {/* Common Questions for Inspiration */}
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Popular questions for inspiration:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "How to handle tantrums?",
                      "Responding to back talk",
                      "Discussing difficult topics",
                      "Helping with anxiety",
                      "Technology boundaries"
                    ].map((q) => (
                      <button 
                        key={q}
                        className="inline-flex text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                        onClick={() => setRecordingTitle(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="upload-title" className="text-sm font-medium">
                    Session Title
                  </label>
                  <input
                    id="upload-title"
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter a title for your recording"
                  />
                </div>
                
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  <label htmlFor="dialog-audio-upload" className="cursor-pointer text-center">
                    <div className="space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Click to upload audio</span>
                      <p className="text-xs text-gray-500">MP3, WAV or M4A up to 50MB</p>
                    </div>
                    <input
                      id="dialog-audio-upload"
                      type="file"
                      accept="audio/*,video/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedUploadFile(file);
                          if (!recordingTitle) {
                            setRecordingTitle(`Uploaded Session ${new Date().toLocaleDateString()}`);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                
                {selectedUploadFile && (
                  <div className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium">Selected file: {selectedUploadFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {Math.round(selectedUploadFile.size / 1024)} KB • Type: {selectedUploadFile.type}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            {!showUploadOption ? (
              <Button
                disabled={!recordingTitle || textUploadMutation.isPending}
                onClick={() => {
                  const textarea = document.getElementById('question-details') as HTMLTextAreaElement;
                  if (textarea && recordingTitle) {
                    handleTextUpload(recordingTitle, textarea.value || "No details provided");
                    setUploadDialogOpen(false);
                  }
                }}
              >
                {textUploadMutation.isPending ? "Submitting..." : "Submit Question"}
              </Button>
            ) : (
              <Button
                disabled={!selectedUploadFile || !recordingTitle || uploadMutation.isPending}
                onClick={() => {
                  if (selectedUploadFile && recordingTitle) {
                    // Create a file with the original filename preserved for proper mime type handling
                    const fileExtension = selectedUploadFile.name.split('.').pop() || 'mp3';
                    
                    // Create a new file object that preserves the original file's content type
                    const preservedFile = new File(
                      [selectedUploadFile], 
                      `${recordingTitle.replace(/[^\w\s.-]/g, '')}.${fileExtension}`, 
                      { type: selectedUploadFile.type }
                    );
                    
                    handleFileUpload(preservedFile, recordingTitle);
                    setUploadDialogOpen(false);
                    setSelectedUploadFile(null);
                  }
                }}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Session"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Title & Description Dialog (after recording) */}
      <Dialog open={recordingBlob !== null} onOpenChange={(open) => {
        if (!open) setRecordingBlob(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Recording</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="recording-title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="recording-title"
                type="text"
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter a title for your recording"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-500">
                Duration: {Math.floor(recordingDuration / 60)}m {recordingDuration % 60}s
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRecordingBlob(null)}>
              Cancel
            </Button>
            <Button
              disabled={!recordingTitle || uploadMutation.isPending}
              onClick={handleSaveRecording}
            >
              {uploadMutation.isPending ? "Saving..." : "Save Recording"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Dialog */}
      <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Session Options</DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Be Better. Pursue Better. Excellence as the standard. Establish Permanent Legacy.
            </p>
          </DialogHeader>
          
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Upload Existing Recording Option */}
            <div className="rounded-md border border-gray-200 p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors">
              <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-center text-base font-medium mb-2">Upload Recording</h3>
              <p className="text-xs text-gray-500 text-center mb-4">
                Upload an existing audio or video recording of a conversation with your child.
              </p>
              <div className="flex justify-center">
                <label htmlFor="audio-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-300 rounded-md shadow-sm hover:bg-primary-50">
                  Upload File
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*,video/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        getAudioDuration(file).then((duration) => {
                          setRecordingDuration(duration);
                          setRecordingTitle(`Uploaded Session ${new Date().toLocaleDateString()}`);
                          
                          // Preserve the original file format
                          const fileExtension = file.name.split('.').pop() || 'mp3';
                          
                          // Create a blob from the file with original content type
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            // Explicitly set the proper MIME type based on file extension
                            const mimeType = file.type || `audio/${fileExtension}`;
                            const blob = new Blob([e.target?.result as ArrayBuffer], { type: mimeType });
                            
                            console.log(`Processed file: ${file.name} with type ${mimeType}`);
                            setRecordingBlob(blob);
                            setRecordDialogOpen(false);
                          };
                          reader.readAsArrayBuffer(file);
                        });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            
            {/* Start New Recording Option */}
            <div className="rounded-md border border-gray-200 p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors">
              <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-center text-base font-medium mb-2">Record New Session</h3>
              <p className="text-xs text-gray-500 text-center mb-4">
                Start a new recording session to capture a conversation with your child.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRecorder(true);
                  }}
                >
                  Start Recording
                </Button>
              </div>
            </div>
          </div>
          
          {/* Suggested Topics */}
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Conversation Topics:</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { name: "Recent Argument", icon: "🔄" },
                { name: "Sports Performance", icon: "🏅" },
                { name: "Academic Achievement", icon: "📚" },
                { name: "Goal Setting", icon: "🎯" },
                { name: "Screen Time", icon: "📱" },
                { name: "Friends & Relationships", icon: "👫" },
              ].map((topic) => (
                <button
                  key={topic.name}
                  className="flex items-center justify-center p-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    toast({
                      title: `Topic Selected: ${topic.name}`,
                      description: "Use this as a starting point for your conversation.",
                    });
                  }}
                >
                  <span className="mr-1">{topic.icon}</span>
                  <span>{topic.name}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Recording Modal */}
      <Dialog open={showRecorder} onOpenChange={setShowRecorder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Conversation</DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Capture a meaningful conversation with your children. Remember to get consent before recording.
            </p>
          </DialogHeader>
          <div className="grid place-items-center gap-4 py-4">
            <Recorder onRecordingComplete={(blob, duration) => {
              setRecordingBlob(blob);
              setRecordingDuration(duration);
              
              const date = new Date();
              const month = date.toLocaleString('en-US', { month: 'short' });
              const day = date.getDate();
              const year = date.getFullYear();
              
              setRecordingTitle(`Family Session ${month} ${day}, ${year}`);
              setShowRecorder(false);
              setRecordDialogOpen(false);
            }} />
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              The recording will be analyzed to provide communication insights and suggestions to help establish excellence as your standard.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}