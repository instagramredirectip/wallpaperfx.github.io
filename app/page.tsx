// src/app/page.tsx
// This component now runs on the Server (for SEO and fast data fetching)

import { supabase } from '@/src/lib/supabase';
import { Wallpaper } from '@/src/types/index';
import InteractiveButtons from '@/src/components/InteractiveButtons';
import { Download } from 'lucide-react';

// --- 1. Data Fetching Logic (Runs on Server) ---

async function getWallpapers(): Promise<Wallpaper[]> {
    const { data: wallpapers, error } = await supabase
        .from('wallpapers')
        // CRITICAL: Must select all properties defined in the Wallpaper type
        .select('id, url_thumb, title, url_full, tags') 
        .limit(20) 
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error fetching wallpapers:', error);
        return [];
    }
    
    // Ensure all data conforms to the 'Wallpaper' type, providing fallbacks for safety
    const safeWallpapers: Wallpaper[] = wallpapers.map(wp => ({
        id: wp.id,
        url_thumb: wp.url_thumb,
        url_full: wp.url_full || wp.url_thumb, // Fallback for download link
        title: wp.title,
        tags: (wp.tags && Array.isArray(wp.tags)) ? wp.tags : ['dark', 'neon', 'curated'], 
    }));

    return safeWallpapers;
}


// --- 2. The Main Component (Runs on Server) ---

export default async function Home() {
    const GRID_WALLPAPERS = await getWallpapers();

    return (
        <main className="min-h-screen bg-background text-white selection:bg-neon-cyan selection:text-black">
            
            {/* 1. Header / Hero (Server Content) */}
            <header className="px-6 py-12 md:py-20 max-w-7xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-purple/20 blur-[120px] rounded-full -z-10" />
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
                    DARK <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">PULSE</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                    Curated 4K OLED wallpapers for the night shift.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                    {['Cars', 'Anime', 'Cyberpunk', 'Nature', 'Pitch Black'].map(cat => (
                        <button key={cat} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:border-neon-cyan hover:bg-neon-cyan/10 transition duration-300 backdrop-blur-sm">
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* 2. Masonry Grid (Server Content) */}
            <section className="px-4 max-w-7xl mx-auto pb-20">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {GRID_WALLPAPERS.map((wp) => (
                        <div key={wp.id} className="relative group break-inside-avoid rounded-xl overflow-hidden bg-surface cursor-pointer">
                            <img 
                                src={wp.url_thumb} 
                                alt={wp.title}
                                className="w-full h-auto transform transition duration-700 group-hover:scale-110 group-hover:opacity-80"
                                loading="lazy"
                            />
                            
                            {/* Hover Overlay with Download Button */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/90 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                                
                                {/* Download Button using native <a> download attribute */}
                                <a
                                    href={wp.url_full} 
                                    download={`${wp.title.replace(/\s/g, '_')}_DarkPulse.webp`} 
                                    className="self-end bg-neon-cyan text-black p-3 rounded-full 
                                                hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] 
                                                transition translate-y-4 group-hover:translate-y-0 
                                                opacity-0 group-hover:opacity-100" 
                                    title={`Download ${wp.title}`}
                                >
                                    <Download size={20} />
                                </a>

                                {/* Title */}
                                <p className="text-white font-bold mt-2 translate-y-4 group-hover:translate-y-0 transition duration-300">
                                    {wp.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Floating Button and Modal (Client Component) */}
            <InteractiveButtons wallpapers={GRID_WALLPAPERS} />
            
        </main>
    );
}