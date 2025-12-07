"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart, Share2, Download, X } from "lucide-react";
import { Wallpaper } from '@/src/types/index'; 


// --- 2. The Component ---
export default function WallpaperReel({ 
    onClose, 
    wallpapers
}: { 
    onClose: () => void,
    wallpapers: Wallpaper[] 
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const dragY = useMotionValue(0);
  const dragThreshold = 100;

  const currentWp = wallpapers[index];
  const totalWallpapers = wallpapers.length;

  // --- DOWNLOAD HANDLER FUNCTION (CRITICAL) ---
  const handleDownload = () => {
    const downloadUrl = currentWp.url_full; // Use the high-res URL
    
    if (!downloadUrl) {
        alert("Download URL not found.");
        return;
    }

    // Standard JavaScript method to force a file download
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Clean file name creation
    const cleanedTitle = currentWp.title.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    link.setAttribute('download', `${cleanedTitle}_DarkPulse.webp`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Download initiated for: ${currentWp.title}`);
  };
  // ---------------------------------------------


  const handleDragEnd = () => {
    if (dragY.get() < -dragThreshold && index < totalWallpapers - 1) {
      setDirection(1); // Down (Next)
      setIndex((prev) => prev + 1);
    } else if (dragY.get() > dragThreshold && index > 0) {
      setDirection(-1); // Up (Previous)
      setIndex((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      scale: 0.85,
      opacity: 0,
      filter: "blur(10px)",
    }),
    center: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        y: { type: "spring", stiffness: 300, damping: 30 },
        scale: { duration: 0.4 },
        filter: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      scale: 0.85,
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.4 },
    }),
  };

  if (!currentWp) {
      return (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white">
              <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition"
              >
                  <X size={24} />
              </button>
              <p>No wallpapers loaded. Please upload content via the Admin Dashboard.</p>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 opacity-30 blur-[100px] pointer-events-none">
         <img src={currentWp.url_thumb} alt="Ambient blur" className="w-full h-full object-cover" />
      </div>

      <div className="relative w-full h-full max-w-md md:h-[90vh] md:rounded-3xl overflow-hidden bg-surface shadow-2xl shadow-neon-purple/20">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition"
        >
            <X size={24} />
        </button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentWp.id}
            custom={direction}
         
            initial="enter"
            animate="center"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            style={{ y: dragY }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The Image */}
            <img
              src={currentWp.url_thumb}
              alt={currentWp.title}
              className="w-full h-full object-cover pointer-events-none select-none"
            />
            
            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />

            {/* Content / Metadata */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col gap-4">
                
                {/* Tags with Neon Glow */}
                <div className="flex gap-2">
                    {(currentWp.tags || []).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-cyan border border-neon-cyan/30 rounded-full bg-neon-cyan/10 backdrop-blur-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className="text-4xl font-bold text-white drop-shadow-lg font-sans">
                    {currentWp.title}
                </h2>

                {/* Interaction Row */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-6">
                        <ActionButton icon={<Heart />} label="Save" color="text-neon-pink" />
                        <ActionButton icon={<Share2 />} label="Share" color="text-white" />
                    </div>
                    
                    {/* Primary Download Action */}
                    <motion.button
                        onClick={handleDownload} // <--- FINAL DOWNLOAD HANDLER
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(57, 255, 20, 0.5)" }}
                        className="bg-neon-green text-black font-extrabold px-6 py-3 rounded-full flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        <span className="uppercase tracking-wide">Get It</span>
                    </motion.button>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe Hint Animation */}
        {index === 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium z-10"
            >
                Swipe Up
            </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper Component for small buttons
function ActionButton({ icon, label, color }: any) {
    return (
        <button className={`flex flex-col items-center gap-1 group ${color}`}>
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition">
                {icon}
            </div>
            <span className="text-[10px] font-medium opacity-80 uppercase">{label}</span>
        </button>
    )
}