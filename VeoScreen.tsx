import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Upload, Film, Loader2, Play, Download, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { checkApiKey, requestApiKey, generateVeoVideo } from '../services/veoService';

interface Props {
  initialImage?: string;
  initialPrompt?: string;
}

export const VeoScreen: React.FC<Props> = ({ initialImage, initialPrompt }) => {
  const [hasKey, setHasKey] = useState(false);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing Veo AI...");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKeyStatus();
    if (initialImage) setImage(initialImage);
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialImage, initialPrompt]);

  const checkKeyStatus = async () => {
    const status = await checkApiKey();
    setHasKey(status);
  };

  const handleUnlock = async () => {
    await requestApiKey();
    // Optimistic update, but safer to recheck
    setTimeout(checkKeyStatus, 1000); 
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    setError(null);

    const messages = [
      "Analyzing physique & posture...",
      "Rigging 3D skeleton...",
      "Applying physics engine...",
      "Rendering lighting and textures...",
      "Finalizing video output..."
    ];
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      setLoadingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 4000);

    try {
      const videoUrl = await generateVeoVideo(
        image, 
        prompt || "A 3D animated character performing this action with perfect form, 4k render, unreal engine style, cinematic lighting."
      );
      setGeneratedVideo(videoUrl);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false); // Reset key state if invalid
        setError("API Session expired. Please select key again.");
      } else {
        setError("Generation failed. Please try again.");
      }
    } finally {
      clearInterval(msgInterval);
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
        <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <Film size={40} className="text-lime-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Unlock AI Studio</h2>
        <p className="text-zinc-400 mb-8">Access Veo 3.1 generation models. Requires a paid GCP API key.</p>
        <Button onClick={handleUnlock} fullWidth>Select API Key</Button>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="mt-4 text-xs text-zinc-500 underline">
          View Billing Documentation
        </a>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto bg-zinc-950">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
            AI Studio <span className="text-[10px] bg-lime-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>
        </h2>
        <Wand2 className="text-lime-400" size={24} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Upload Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden group">
            {image ? (
                <>
                    <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center">
                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="bg-black/50 backdrop-blur-md border border-white/20">
                            Change Image
                        </Button>
                    </div>
                </>
            ) : (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-zinc-700 transition-colors">
                        <Upload className="text-zinc-400" />
                    </div>
                    <p className="text-white font-bold">Upload Photo</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />
        </div>

        {/* Prompt Input */}
        <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Instruction</label>
            <div className="relative">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how the character should move (e.g. 'A 3D character doing a perfect squat')"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-lime-400 transition-colors text-sm min-h-[100px]"
                />
                <Sparkles size={16} className="absolute top-4 right-4 text-zinc-600" />
            </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                {error}
            </div>
        )}

        {/* Generate Button / Output */}
        {isGenerating ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center animate-pulse">
                <Loader2 size={40} className="text-lime-400 animate-spin mb-4" />
                <h3 className="text-white font-bold text-lg mb-1">Generating Video</h3>
                <p className="text-zinc-400 text-sm">{loadingMessage}</p>
                <div className="w-full bg-zinc-800 h-1 mt-6 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-400 w-1/2 animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        ) : generatedVideo ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl aspect-[9/16] bg-black">
                    <video 
                        src={generatedVideo} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain"
                    />
                </div>
                <Button fullWidth onClick={() => { setGeneratedVideo(null); setIsGenerating(false); }}>
                    Generate Another
                </Button>
            </div>
        ) : (
            <Button 
                fullWidth 
                onClick={handleGenerate} 
                disabled={!image}
                className={!image ? "opacity-50 cursor-not-allowed" : ""}
            >
                <Film size={18} className="mr-2 inline" /> 
                Generate Video
            </Button>
        )}
      </div>
    </div>
  );
};