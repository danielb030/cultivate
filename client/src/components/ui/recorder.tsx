import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startRecording, stopRecording } from "@/lib/audio-utils";

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

export function Recorder({ onRecordingComplete }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      setIsDialogOpen(true);
      
      const { mediaRecorder, stream } = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Combine the audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
        onRecordingComplete(audioBlob, recordingTime);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Reset the recording state
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);
        setIsRecording(false);
        setIsDialogOpen(false);
      };
      
      // Start recording and timer
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Recording Failed",
        description: "Could not access your microphone. Please ensure your browser has permission to use it.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      stopRecording(mediaRecorderRef.current);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      // Don't call onRecordingComplete to discard the recording
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
      setIsRecording(false);
      setIsDialogOpen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage (assume max recording time is 10 minutes)
  const progressPercentage = Math.min((recordingTime / 600) * 100, 100);

  return (
    <>
      <Button 
        onClick={handleStartRecording}
        className="w-full flex items-center justify-center px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md"
      >
        <Mic className="mr-2 h-5 w-5" />
        Start Recording
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Recording in Progress</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              Capturing your conversation. Make sure to speak clearly and ask open-ended questions.
            </p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
          <DialogFooter className="sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleCancelRecording}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleStopRecording}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop and Transcribe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
