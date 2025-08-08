"use client"

import { useState, useMemo } from "react"
import { Search, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function EpisodeListGrid() {
  const [activeEpisode, setActiveEpisode] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeRange, setActiveRange] = useState("1-20") // New state for active range
  const allEpisodes = Array.from({ length: 100 }, (_, i) => i + 1) // Example: 100 episodes

  const episodeRanges = ["1-20", "21-40", "41-60", "61-80", "81-100"] // Define available ranges

  const filteredEpisodes = useMemo(() => {
    const [startStr, endStr] = activeRange.split("-")
    const start = Number.parseInt(startStr)
    const end = Number.parseInt(endStr)

    let currentEpisodes = allEpisodes.filter((epNum) => epNum >= start && epNum <= end)

    if (searchTerm) {
      currentEpisodes = currentEpisodes.filter((epNum) => epNum.toString().includes(searchTerm))
    }

    return currentEpisodes
  }, [searchTerm, activeRange, allEpisodes])

  return (
    <div className="p-2 bg-neutral-900 text-white">
      <h2 className="text-base font-semibold mb-2">List of episodes</h2>

      {/* Header with Dropdown and Search */}
      <div className="flex flex-row items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <List className="w-4 h-4 text-neutral-400" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between text-neutral-300 hover:bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 text-xs"
              >
                <span>EPS: {activeRange}</span> {/* Display active range */}
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white">
              {episodeRanges.map((range) => (
                <DropdownMenuItem
                  key={range}
                  className="hover:bg-neutral-700 cursor-pointer"
                  onClick={() => setActiveRange(range)} // Set active range on click
                >
                  EPS: {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative max-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Number of Ep"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:border-accent focus:ring-accent text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Episode Grid */}
      <div className="grid grid-cols-5 gap-1">
        {filteredEpisodes.map((epNum) => (
          <Button
            key={epNum}
            className={`py-1 px-0.5 rounded-lg text-xs font-semibold ${
              activeEpisode === epNum
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
            onClick={() => setActiveEpisode(epNum)}
          >
            {epNum}
          </Button>
        ))}
      </div>
    </div>
  )
}
