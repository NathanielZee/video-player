"use client"

import { VideoCard } from "./video-card"
import type { Video } from "@/lib/videos"

interface VideoListProps {
  videos: Video[]
  onSelectVideo: (video: Video) => void
  selectedVideoId: string | null
}

export function VideoList({ videos, onSelectVideo, selectedVideoId }: VideoListProps) {
  return (
    <div className="space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onSelect={onSelectVideo} isSelected={video.id === selectedVideoId} />
      ))}
    </div>
  )
}
