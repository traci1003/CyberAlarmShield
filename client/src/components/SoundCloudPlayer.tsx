import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";

interface SoundCloudPlayerProps {
  playlistUrl?: string;
  autoPlay?: boolean;
  onPlaylistChange?: (url: string) => void;
  className?: string;
}

export function SoundCloudPlayer({
  playlistUrl = "",
  autoPlay = false,
  onPlaylistChange,
  className = ""
}: SoundCloudPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [editingUrl, setEditingUrl] = useState(playlistUrl);
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  useEffect(() => {
    setEditingUrl(playlistUrl);
  }, [playlistUrl]);

  const handlePlayPause = () => {
    if (iframeRef.current) {
      // Toggle play/pause state
      setIsPlaying(!isPlaying);
      
      try {
        // This would work if iframe APIs are available, but for SoundCloud
        // we're using a more basic approach with autoplay parameter
        if (!isPlaying) {
          iframeRef.current.src = iframeRef.current.src.replace("auto_play=false", "auto_play=true");
        } else {
          iframeRef.current.src = iframeRef.current.src.replace("auto_play=true", "auto_play=false");
        }
      } catch (error) {
        console.error("Error controlling playback:", error);
      }
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      try {
        // Similar to play/pause, we would update the iframe src parameter for mute
        if (!isMuted) {
          // Mute audio by modifying iframe parameters or using iframe API
          iframeRef.current.src = iframeRef.current.src + "&mute=true";
        } else {
          // Unmute audio
          iframeRef.current.src = iframeRef.current.src.replace("&mute=true", "");
        }
      } catch (error) {
        console.error("Error controlling volume:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onPlaylistChange) {
      onPlaylistChange(editingUrl);
    }
    setShowUrlInput(false);
  };

  // Format URL for SoundCloud iframe
  const getEmbedUrl = () => {
    if (!playlistUrl) return "";
    
    // Basic validation to ensure it's a SoundCloud URL
    if (!playlistUrl.includes("soundcloud.com")) {
      return "";
    }
    
    // Create iframe compatible URL
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(playlistUrl)}&color=%23ff5500&auto_play=${autoPlay ? 'true' : 'false'}&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  };

  const embedUrl = getEmbedUrl();

  // If no URL provided, show placeholder or URL input
  if (!embedUrl) {
    return (
      <Card className={`border border-primary/20 overflow-hidden ${className}`}>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          {showUrlInput ? (
            <form onSubmit={handleSubmit} className="w-full space-y-2">
              <Input
                type="url"
                placeholder="https://soundcloud.com/username/playlist"
                value={editingUrl}
                onChange={(e) => setEditingUrl(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button type="submit" size="sm">Save</Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowUrlInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                No SoundCloud playlist set
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUrlInput(true)}
              >
                Add SoundCloud URL
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="aspect-video rounded-md overflow-hidden">
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={embedUrl}
          title="SoundCloud Player"
          className="w-full h-full"
        />
      </div>
      
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleMute}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={() => window.open(playlistUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}