import { CustomVideoPlayer } from "@/components/custom-video-player"
import { EpisodeSelector } from "@/components/episode-selector"
import { EpisodeListGrid } from "@/components/episode-list-grid"

export default function WatchPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Video Player Section */}
      <div className="w-full bg-black">
        <CustomVideoPlayer
          videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          title="I'm Luffy! The Man Who..."
          description="One Piece Episode 1"
        />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-0 sm:px-4 py-4 space-y-4">
        {/* Episode Selector (Sub/Dub) */}
        <EpisodeSelector />

        {/* Episode List Grid */}
        <EpisodeListGrid />
      </div>
    </div>
  )
}
