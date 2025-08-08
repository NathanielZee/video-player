"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Lock,
  Unlock,
  ChevronRight,
  ArrowLeft,
  Subtitles,
  Cast,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface CustomVideoPlayerProps {
  videoSrc: string
  title: string
  description: string
}

export function CustomVideoPlayer({ videoSrc, title, description }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocked, setIsLocked] = useState(false) // State for lock functionality
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reset state when video source changes
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsBuffering(true)

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsBuffering(false)
    }
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("ended", handleEnded)

    // Load the new video source
    video.load()

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("ended", handleEnded)
    }
  }, [videoSrc])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || isLocked) return // Prevent play/pause when locked

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="relative w-full aspect-video bg-black overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video ref={videoRef} className="w-full h-full object-cover" src={videoSrc} onClick={togglePlay} />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent" />
        </div>
      )}

      {/* Lock Overlay (only visible when locked) */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Button
            onClick={() => setIsLocked(false)} // Unlock button
            className={`w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <Unlock className="w-8 h-8" fill="currentColor" />
          </Button>
        </div>
      )}

      {/* Controls Overlay (hidden when locked) */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-300 ${
          showControls && !isLocked ? "opacity-100" : "opacity-0"
        } ${isLocked ? "pointer-events-none" : ""}`}
      >
        {/* Top Navigation */}
        <div className="flex items-center justify-between w-full text-white bg-gradient-to-b from-black/70 to-transparent pb-4 pt-2 px-3">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-base font-semibold truncate">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <Subtitles className="w-5 h-5 text-white" />
            </Button>
            <Button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <Cast className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>

        {/* Top-left and Top-right time */}
        <div
          className={`flex justify-between text-white text-xs font-mono absolute top-1/2 left-3 right-3 -translate-y-1/2 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Center Play/Pause Button */}
        <div className="flex-1 flex items-center justify-center">
          {!isPlaying && !isBuffering && (
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg"
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </Button>
          )}
          {isPlaying && !isBuffering && (
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg"
            >
              <Pause className="w-8 h-8" fill="currentColor" />
            </Button>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="w-full bg-gradient-to-t from-black/70 to-transparent pt-4 pb-2 px-3">
          {/* Progress Bar */}
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-neutral-700 [&>span:first-child>span]:bg-accent [&>span:first-child>span]:h-1 [&>span:first-child>span]:rounded-full [&>span:last-child]:w-3 [&>span:last-child]:h-3 [&>span:last-child]:bg-accent [&>span:last-child]:border-0"
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {/* Lock Button */}
              <Button
                onClick={() => setIsLocked(!isLocked)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>

              {/* Volume Control */}
              <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white hover:bg-white/10">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-neutral-700 [&>span:first-child>span]:bg-accent [&>span:first-child>span]:h-1 [&>span:first-child>span]:rounded-full [&>span:last-child]:w-3 [&>span:last-child]:h-3 [&>span:last-child]:bg-accent [&>span:last-child]:border-0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Next Episode Button */}
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Fullscreen */}
              <Button onClick={toggleFullscreen} variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
