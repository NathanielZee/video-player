"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { Video } from "@/lib/videos"

interface VideoCardProps {
  video: Video
  onSelect: (video: Video) => void
  isSelected: boolean
}

export function VideoCard({ video, onSelect, isSelected }: VideoCardProps) {
  return (
    <Card
      className={`cursor-pointer bg-neutral-900 text-white border-2 ${
        isSelected ? "border-accent" : "border-transparent"
      } hover:border-accent transition-colors duration-200`}
      onClick={() => onSelect(video)}
    >
      <CardContent className="p-0">
        <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
          <Image
            src={video.poster || "/placeholder.svg"}
            alt={video.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{video.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
