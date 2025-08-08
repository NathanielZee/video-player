"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Video } from "@/lib/videos"

interface VideoPlayerProps {
  video: Video | null
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || !video) return

    // Reset state when video changes
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsBuffering(true) // Assume buffering when new video loads

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setIsBuffering(false)
    }
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleEnded = () => setIsPlaying(false)

    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)
    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    videoElement.addEventListener("waiting", handleWaiting)
    videoElement.addEventListener("playing", handlePlaying)
    videoElement.addEventListener("ended", handleEnded)

    // Load the new video source
    videoElement.load()

    return () => {
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.removeEventListener("waiting", handleWaiting)
      videoElement.removeEventListener("playing", handlePlaying)
      videoElement.removeEventListener("ended", handleEnded)
    }
  }, [video]) // Re-run effect when `video` prop changes

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newTime = (value[0] / 100) * duration
    videoElement.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newVolume = value[0] / 100
    videoElement.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isMuted) {
      videoElement.volume = volume
      setIsMuted(false)
    } else {
      videoElement.volume = 0
      setIsMuted(true)
    }
  }

  const skipTime = (seconds: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.currentTime = Math.max(0, Math.min(duration, videoElement.currentTime + seconds))
  }

  const toggleFullscreen = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (!isFullscreen) {
      videoElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  if (!video) {
    return (
      <div className="relative bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center h-[450px] text-white/60 text-xl">
        Select a video to play
      </div>
    )
  }

  return (
    <div
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        src={video.src}
        poster={video.poster}
        onClick={togglePlay}
      />

      {/* Play Button Overlay */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-20 h-20 rounded-full bg-accent hover:bg-accent/90 text-black shadow-lg"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </Button>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider value={[progressPercentage]} onValueChange={handleSeek} max={100} step={0.1} className="w-full" />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="text-white hover:text-accent hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            {/* Skip Buttons */}
            <Button
              onClick={() => skipTime(-10)}
              variant="ghost"
              size="sm"
              className="text-white hover:text-accent hover:bg-white/10"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => skipTime(10)}
              variant="ghost"
              size="sm"
              className="text-white hover:text-accent hover:bg-white/10"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:text-accent hover:bg-white/10"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-20">
                <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Settings */}
            <Button variant="ghost" size="sm" className="text-white hover:text-accent hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Fullscreen */}
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:text-accent hover:bg-white/10"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="absolute top-6 left-6 right-6">
        <div className={`transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <h1 className="text-white text-2xl font-bold mb-2">{video.title}</h1>
          <p className="text-white/80 text-sm">{video.description}</p>
        </div>
      </div>
    </div>
  )
}
