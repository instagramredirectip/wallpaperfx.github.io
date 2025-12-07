"use client"; // <--- THIS IS CRITICAL

import { useState } from "react";
import { Play } from "lucide-react";
import WallpaperReel from "@/src/components/WallpaperReel";
import { Wallpaper } from '@/src/types/index'; // Import the centralized type

interface InteractiveButtonsProps {
    wallpapers: Wallpaper[];
}

export default function InteractiveButtons({ wallpapers }: InteractiveButtonsProps) {
    // This is where the state management lives, requiring "use client"
    const [showReels, setShowReels] = useState(false);

    return (
        <>
            {/* 1. Floating "Immersive Mode" Button */}
            <button
                onClick={() => setShowReels(true)}
                className="fixed bottom-8 right-8 z-40 bg-neon-cyan text-black p-4 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-110 transition active:scale-95 animate-pulse-slow"
            >
                <Play fill="black" size={32} />
            </button>

            {/* 2. The Reels Modal Overlay */}
            {showReels && (
                <WallpaperReel wallpapers={wallpapers} onClose={() => setShowReels(false)} />
            )}
        </>
    );
}