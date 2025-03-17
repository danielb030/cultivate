import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadAudioProps {
  onUpload: (file: File, title: string, description?: string) => Promise<void>;
  isUploading?: boolean;
}

export function UploadAudio({ onUpload, isUploading = false }: UploadAudioProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      
      // Auto-generate a title based on the file name
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setTitle(fileNameWithoutExt || "New recording");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your recording",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onUpload(selectedFile, title);
      // Reset form after successful upload
      setSelectedFile(null);
      setTitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-primary-50 transition-colors ${
                selectedFile ? "border-primary-500 bg-primary-50" : "border-gray-300"
              }`}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                {selectedFile ? (
                  <p className="text-sm font-medium text-primary-600">{selectedFile.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop an audio file
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                MP3, WAV, M4A up to 50MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Recording Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your recording"
                disabled={isUploading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Recording"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
