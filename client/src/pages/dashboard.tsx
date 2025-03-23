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

  // Fetch recordings
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
    setRecordingTitle(`Recording ${format(new Date(), "MMM d, yyyy")} at ${format(new Date(), "h:mm a")}`);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy") + " at " + format(date, "h:mm a");
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

      {/* Recent Recordings */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Recent Recordings</h2>
          <select className="bg-white border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option>All Recordings</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>

        {isLoading ? (
          // Loading state
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="mb-6">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-64 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="mt-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          // Error state
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load recordings. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : recordings && recordings.length > 0 ? (
          // Recordings list
          recordings.map((recording: any) => {
            // Parse transcript if it exists
            let transcriptData;
            try {
              transcriptData = recording.transcript ? JSON.parse(recording.transcript) : null;
            } catch (e) {
              transcriptData = null;
            }
            
            return (
              <Card key={recording.id} className="mb-6">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900">{recording.title}</h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {formatDate(recording.recordedAt)} • {formatDuration(recording.duration)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => deleteMutation.mutate(recording.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {transcriptData && (
                      <div className="mt-4 text-sm text-neutral-700 space-y-4">
                        {transcriptData.segments.slice(0, 3).map((segment: any) => (
                          <div key={segment.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                                segment.speaker === "Parent" ? "bg-primary-100" : "bg-secondary-100"
                              }`}>
                                <span className={`text-xs font-medium ${
                                  segment.speaker === "Parent" ? "text-primary-800" : "text-secondary-800"
                                }`}>
                                  {segment.speaker.charAt(0)}
                                </span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{segment.speaker}</p>
                              <p>{segment.text}</p>
                            </div>
                          </div>
                        ))}
                        <Link href={`/recordings/${recording.id}`}>
                          <a className="text-primary-600 hover:text-primary-500 font-medium">
                            Show full transcript
                          </a>
                        </Link>
                      </div>
                    )}
                    
                    {recording.analysis && (
                      <div className="mt-6 border-t border-neutral-200 pt-4">
                        <h4 className="text-sm font-medium text-neutral-900">Analysis & Insights</h4>
                        <div className="mt-2 bg-neutral-50 p-3 rounded-md">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-neutral-700">{recording.analysis.summary}</p>
                              {recording.analysis.suggestions && recording.analysis.suggestions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  <h5 className="text-xs font-medium text-neutral-800">Suggestions:</h5>
                                  <ul className="text-xs text-neutral-700 list-disc pl-5 space-y-1">
                                    {recording.analysis.suggestions.map((suggestion: string, i: number) => (
                                      <li key={i}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {recording.analysis && recording.analysis.tags && (
                    <div className="bg-neutral-50 px-5 py-3 flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {recording.analysis.tags.map((tag: string, i: number) => (
                          <Badge 
                            key={i} 
                            variant="outline"
                            className="bg-opacity-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/recordings/${recording.id}`}>
                        <a className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          View Details
                        </a>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          // Empty state
          <Card className="mb-6 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary-100 p-3">
                <PlusCircle className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recordings yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by recording a conversation or uploading an audio file.
              </p>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => setRecordDialogOpen(true)}>Start Recording</Button>
                <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>Upload Audio</Button>
              </div>
            </div>
          </Card>
        )}

        {recordings && recordings.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="inline-flex items-center">
              Load More Recordings
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Conversation Recording</DialogTitle>
          </DialogHeader>
          
          {recordingBlob ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Recording Title
                </label>
                <input
                  id="title"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration</span>
                  <span className="text-sm text-gray-500">{formatDuration(recordingDuration)}</span>
                </div>
                <audio 
                  controls 
                  src={URL.createObjectURL(recordingBlob)} 
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRecordingBlob(null);
                    setUploadDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveRecording} disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Saving..." : "Save Recording"}
                </Button>
              </div>
            </div>
          ) : (
            <UploadAudio onUpload={handleFileUpload} isUploading={uploadMutation.isPending} />
          )}
        </DialogContent>
      </Dialog>

      {/* Recording Dialog */}
      <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record a Conversation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-6">
              Record a conversation with your child to get personalized insights and parenting tips.
            </p>
            <Recorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
