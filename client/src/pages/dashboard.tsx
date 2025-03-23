import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PlusCircle, Cloud, MoreHorizontal, Share2, Edit, Trash2, ChevronDown, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
    
    setRecordingTitle(`Recording ${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`);
    setRecordDialogOpen(false);
    setUploadDialogOpen(true);
  };

  const handleSaveRecording = () => {
    if (recordingBlob && recordingTitle) {
      // Create a File object from the Blob
      const file = new File([recordingBlob], `${recordingTitle}.mp3`, { type: "audio/mpeg" });
      uploadMutation.mutate({ file, title: recordingTitle });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <LandingHero 
        onRecordingComplete={handleRecordingComplete}
        onAudioUpload={handleFileUpload}
        onTextUpload={handleTextUpload}
        isUploading={uploadMutation.isPending || textUploadMutation.isPending}
      />
      
      {/* Clean Dashboard - Recent Recordings section has been moved to the Recordings page */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Improve Your Family Communications
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Get started by recording a conversation or uploading an audio file via the options above.
            View your existing recordings in the "Recordings" tab.
          </p>
          <div className="mt-8 flex justify-center">
            <Link 
              href="/recordings" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View All Recordings
            </Link>
          </div>
        </div>
      </div>

      {/* Title & Description Dialog (after recording) */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
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

      {/* Record Dialog */}
      <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record a Conversation</DialogTitle>
          </DialogHeader>
          <div className="grid place-items-center gap-6 py-4">
            <Recorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}