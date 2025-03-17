/**
 * Utility functions for audio recording and playback
 */

// Starts a new audio recording
export async function startRecording(): Promise<{ mediaRecorder: MediaRecorder; stream: MediaStream }> {
  try {
    // Request access to the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create a new MediaRecorder instance using the stream
    const mediaRecorder = new MediaRecorder(stream);
    
    // Start recording
    mediaRecorder.start();
    
    return { mediaRecorder, stream };
  } catch (error) {
    console.error("Error starting recording:", error);
    throw new Error("Could not access microphone. Please ensure your browser has permission.");
  }
}

// Stops an active recording
export function stopRecording(mediaRecorder: MediaRecorder): void {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

// Gets the duration of an audio file
export function getAudioDuration(audioFile: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioFile);
    
    audio.addEventListener('loadedmetadata', () => {
      // Get duration in seconds
      const duration = Math.round(audio.duration);
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(audio.src);
      resolve(duration);
    });
    
    // Handle errors
    audio.addEventListener('error', () => {
      console.error("Error loading audio file");
      URL.revokeObjectURL(audio.src);
      resolve(0); // Return 0 on error
    });
  });
}

// Converts an audio blob to a File object
export function audioBlobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type });
}

// Formats a time in seconds to MM:SS format
export function formatAudioTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Creates an audio waveform visualization (basic implementation)
export function visualizeAudio(audioElement: HTMLAudioElement, canvas: HTMLCanvasElement): void {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audioElement);
  
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  function draw() {
    requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    ctx.fillStyle = 'rgb(240, 240, 240)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      
      ctx.fillStyle = `rgb(66, 91, 246)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  }
  
  draw();
}

// Check if browser supports audio recording
export function supportsRecording(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
