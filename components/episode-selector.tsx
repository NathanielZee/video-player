"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function EpisodeSelector() {
  const [activeTab, setActiveTab] = useState("sub")

  return (
    <div className="p-2 bg-neutral-900 text-white">
      <p className="text-xs text-center text-neutral-400 mb-2">
        You are watching <span className="text-accent font-semibold">Episode 1</span>
      </p>

      {/* Sub/Dub Tabs */}
      <div className="flex border-b border-neutral-800 mb-3">
        <Button
          variant="ghost"
          className={`flex-1 rounded-none py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "sub"
              ? "text-white border-b-2 border-accent" // Active: White text, accent underline
              : "text-neutral-400 hover:text-accent hover:border-accent border-b-2 border-transparent" // Inactive: Grey text, transparent underline; on hover: accent text, accent underline
          }`}
          onClick={() => setActiveTab("sub")}
        >
          Sub
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-none py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "dub"
              ? "text-white border-b-2 border-accent" // Active: White text, accent underline
              : "text-neutral-400 hover:text-accent hover:border-accent border-b-2 border-transparent" // Inactive: Grey text, transparent underline; on hover: accent text, accent underline
          }`}
          onClick={() => setActiveTab("dub")}
        >
          Dub
        </Button>
      </div>
    </div>
  )
}
