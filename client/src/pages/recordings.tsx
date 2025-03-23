import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PlusCircle, MoreHorizontal, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

export default function Recordings() {
  // Fetch recordings
  const { data: recordings = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ["/api/recordings"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">All Recordings</h1>
        <select className="bg-white border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
          <option>All Recordings</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="mb-6">
              <CardContent className="p-5">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load recordings. Please try again later.
          </AlertDescription>
        </Alert>
      ) : recordings && recordings.length > 0 ? (
        // Recordings list
        <div>
          {recordings.map((recording: any) => {
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
                            <DropdownMenuItem>
                              <Link href={`/recordings/${recording.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Transcript preview */}
                    {transcriptData && (
                      <div className="mt-4 text-neutral-700">
                        <p>{transcriptData.text.length > 200 
                          ? `${transcriptData.text.substring(0, 200)}...` 
                          : transcriptData.text}
                        </p>
                        <button 
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/recordings/${recording.id}`;
                          }}
                        >
                          Show full transcript
                        </button>
                      </div>
                    )}

                    {/* Analysis tags */}
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
                        <Link href={`/recordings/${recording.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = "/"}
            >
              Record or Upload
            </Button>
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
  );
}