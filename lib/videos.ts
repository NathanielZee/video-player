export const videos = [
  {
    id: "1",
    title: "Big Buck Bunny",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/placeholder.svg?height=720&width=1280",
    description: "A short computer-animated comedy film by the Blender Institute.",
  },
  {
    id: "2",
    title: "Sintel",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "/placeholder.svg?height=720&width=1280",
    description: "A fantasy film about a young woman named Sintel who is searching for her lost baby dragon.",
  },
  {
    id: "3",
    title: "Tears of Steel",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "/placeholder.svg?height=720&width=1280",
    description:
      "A short science fiction film about a group of scientists and artists who are trying to save the world.",
  },
  {
    id: "4",
    title: "For Bigger Blazes",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/placeholder.svg?height=720&width=1280",
    description: "A short film about a fire-breathing dragon.",
  },
  {
    id: "5",
    title: "For Bigger Escape",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "/placeholder.svg?height=720&width=1280",
    description: "A short film about a daring escape.",
  },
]

export type Video = (typeof videos)[0]
