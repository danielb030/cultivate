import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  ArrowLeft, Share2, Edit, Trash2, Download, Play, Pause, AlertCircle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RecordingDetail() {
  const [match, params] = useRoute("/recordings/:id");
  const [, navigate] = useLocation();
  const recordingId = params?.id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Fetch recording details
  const { data: recording, isLoading, isError } = useQuery({
    queryKey: [`/api/recordings/${recordingId}`],
    enabled: !!recordingId,
  });

  // Parse transcript if it exists
  let transcriptData;
  try {
    transcriptData = recording?.transcript ? JSON.parse(recording.transcript) : null;
  } catch (e) {
    transcriptData = null;
  }

  // Set up audio player
  const handlePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioElement) {
      setDuration(audioElement.duration);
    }
  };

  const handleSliderChange = (newValue: number[]) => {
    if (audioElement) {
      const time = newValue[0];
      audioElement.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy") + " at " + format(date, "h:mm a");
  };

  if (!match) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 text-gray-500 hover:text-gray-700"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recordings
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-16 w-full rounded-md" />
          <div className="space-y-6 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load recording details. Please try again later.
          </AlertDescription>
        </Alert>
      ) : recording ? (
        <div>
          {/* Recording header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{recording.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(recording.recordedAt)} • {Math.floor(recording.duration / 60)} minutes
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Actions</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
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
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Audio player */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handlePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="my-1.5"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              {/* Hidden audio element */}
              <audio
                ref={(el) => setAudioElement(el)}
                src={`/api/audio/${recording.audioPath}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {recording.analysis && recording.analysis.tags && recording.analysis.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {recording.analysis.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Transcript */}
          {transcriptData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Transcript</h2>
              <div className="space-y-6">
                {transcriptData.segments.map((segment: any) => (
                  <div key={segment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                        segment.speaker === "Parent" ? "bg-primary-100" : "bg-secondary-100"
                      }`}>
                        <span className={`font-medium ${
                          segment.speaker === "Parent" ? "text-primary-800" : "text-secondary-800"
                        }`}>
                          {segment.speaker.charAt(0)}
                        </span>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900">{segment.speaker}</p>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatTime(segment.start)}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-700 text-base">
                        {segment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis & Insights */}
          {recording.analysis && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Analysis & Insights</h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-2">Summary</h3>
                  <p className="text-gray-700 mb-6">{recording.analysis.summary}</p>
                  
                  {recording.analysis.suggestions && recording.analysis.suggestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Suggestions</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {recording.analysis.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {recording.analysis.growthAreas && recording.analysis.growthAreas.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Growth Areas</h3>
                      <div className="space-y-3">
                        {recording.analysis.growthAreas.map((area: any, i: number) => (
                          <div key={i} className="p-3 rounded-md bg-gray-50">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-900">{area.area}</h4>
                              <Badge 
                                variant="outline"
                                className={`${
                                  area.priority === "High" 
                                    ? "bg-red-100 text-red-800" 
                                    : area.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                Priority: {area.priority}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">{area.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {recording.analysis.communicationStyle && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Communication Style</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Open-Ended Questions</span>
                          <span>{recording.analysis.communicationStyle.openEndedQuestions}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${recording.analysis.communicationStyle.openEndedQuestions}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Active Listening</span>
                          <span>{recording.analysis.communicationStyle.activeListening}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${recording.analysis.communicationStyle.activeListening}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Emotional Support</span>
                          <span>{recording.analysis.communicationStyle.emotionalSupport}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${recording.analysis.communicationStyle.emotionalSupport}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {recording.analysis.topics && recording.analysis.topics.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Topics Discussed</h3>
                    <div className="space-y-4">
                      {recording.analysis.topics.map((topic: any) => (
                        <div key={topic.name} className="flex items-center">
                          <div className="w-1/3">
                            <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                          </div>
                          <div className="w-2/3 flex items-center">
                            <div className="bg-blue-100 h-2.5 rounded-full w-full">
                              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${topic.percentage}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 ml-2">{topic.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation between recordings */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Recording
            </Button>
            <Button variant="outline" className="flex items-center">
              Next Recording
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Recording not found</p>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
