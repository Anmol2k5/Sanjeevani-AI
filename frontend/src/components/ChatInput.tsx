import { useState, useRef } from "react";
import { Send, Paperclip, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoScanner } from "./PhotoScanner";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const hasContent = message.trim().length > 0;

  const handleSubmit = () => {
    if (!hasContent && !file) return;
    onSend(message.trim(), file || undefined);
    setMessage("");
    setFile(null);
  };

  const handleCapture = (capturedFile: File) => {
    setFile(capturedFile);
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <PhotoScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onCapture={handleCapture}
      />

      {file && (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground p-2 bg-secondary/50 rounded-lg">
          <Paperclip className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-destructive hover:underline ml-auto text-xs font-medium">Remove</button>
        </div>
      )}
      <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2 border border-transparent focus-within:border-hospital-blue-primary/30 transition-all shadow-inner">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2 text-muted-foreground hover:text-hospital-blue-primary hover:bg-white/50 rounded-full transition-all"
            title="Upload Photo"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="p-2 text-muted-foreground hover:text-hospital-blue-primary hover:bg-white/50 rounded-full transition-all"
            title="Scan Photo"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          placeholder="Describe symptoms or scan photo..."
          className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none px-2"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={isLoading || (!hasContent && !file)}
          className={`h-9 w-9 rounded-full transition-all shadow-md ${
            hasContent || file 
              ? "bg-hospital-blue-primary hover:bg-hospital-blue-dark text-white scale-100" 
              : "bg-muted text-muted-foreground scale-95 opacity-50"
          }`}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
