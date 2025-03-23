import { useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { Label } from "./label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UploadTextProps {
  onUpload: (title: string, text: string) => Promise<void>;
  isUploading?: boolean;
}

export function UploadText({ onUpload, isUploading = false }: UploadTextProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your conversation",
        variant: "destructive",
      });
      return;
    }
    
    if (!text.trim()) {
      toast({
        title: "Text required",
        description: "Please paste or type your conversation transcript",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onUpload(title, text);
      
      // Reset form after successful upload
      setTitle("");
      setText("");
      
      toast({
        title: "Analysis started",
        description: "Your conversation is being analyzed. This may take a moment.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          placeholder="e.g., 'Dinner conversation about homework'" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transcript" className="flex justify-between">
          <span>Conversation Transcript</span>
          <span className="text-sm text-muted-foreground">
            Format: Include "Parent:" and "Child:" at the beginning of lines
          </span>
        </Label>
        <Textarea
          id="transcript"
          placeholder={`Parent: How was school today?\nChild: It was okay. We had a math test.\nParent: How do you think you did?\nChild: I think I did well!`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="min-h-[200px] resize-y"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Tip: For best analysis, clearly indicate who is speaking. If you don't include speaker indicators, our AI will try to determine them automatically.
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Conversation"
        )}
      </Button>
    </form>
  );
}