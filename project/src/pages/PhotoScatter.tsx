import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  scale: number;
}

const PhotoScatter: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Color palettes for different moods
  const colorPalettes = [
    // Warm sunset
    ['orange', 'sunset', 'warm', 'golden', 'amber'],
    // Cool blues
    ['blue', 'ocean', 'sky', 'water', 'cool'],
    // Nature greens
    ['green', 'nature', 'forest', 'plant', 'leaf'],
    // Monochrome
    ['black', 'white', 'gray', 'monochrome', 'minimal'],
    // Vintage
    ['vintage', 'retro', 'sepia', 'old', 'film'],
    // Urban
    ['city', 'urban', 'street', 'architecture', 'modern']
  ];

  // Generate random photos with similar color palette
  const generatePhotos = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Select random color palette
    const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    const photoCount = Math.floor(Math.random() * 16) + 10; // 10-25 photos
    
    const newPhotos: Photo[] = [];
    
    for (let i = 0; i < photoCount; i++) {
      // Use Pexels API with color palette keywords
      const keyword = palette[Math.floor(Math.random() * palette.length)];
      const width = Math.floor(Math.random() * 200) + 200; // 200-400px width
      const height = Math.floor(Math.random() * 200) + 200; // 200-400px height
      
      // Generate random position within container
      const maxX = containerRect.width - width;
      const maxY = containerRect.height - height;
      const x = Math.random() * Math.max(maxX, 0);
      const y = Math.random() * Math.max(maxY, 0);
      
      newPhotos.push({
        id: `photo-${i}-${Date.now()}`,
        url: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop&crop=center&q=${keyword}`,
        x,
        y,
        rotation: (Math.random() - 0.5) * 30, // -15 to 15 degrees
        zIndex: i + 1,
        scale: 0.8 + Math.random() * 0.4 // 0.8 to 1.2 scale
      });
    }
    
    setPhotos(newPhotos);
    setHighestZIndex(photoCount);
  };

  // Handle photo drag
  const handleMouseDown = (photoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedPhoto(photoId);
    
    // Bring to front
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, zIndex: highestZIndex + 1 }
        : photo
    ));
    setHighestZIndex(prev => prev + 1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedPhoto || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    setPhotos(prev => prev.map(photo => 
      photo.id === draggedPhoto 
        ? { ...photo, x: x - 100, y: y - 100 } // Center on cursor
        : photo
    ));
  };

  const handleMouseUp = () => {
    setDraggedPhoto(null);
  };

  // Close photo
  const closePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // Clear all photos
  const clearAllPhotos = () => {
    setPhotos([]);
  };

  // Mouse event listeners
  useEffect(() => {
    if (draggedPhoto) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPhoto]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link 
            to="/home" 
            className="flex items-center gap-2 text-black hover:bg-black hover:text-white transition-colors px-3 py-2 border-2 border-black neobrutalist-text"
          >
            <ArrowLeft size={16} />
            BACK
          </Link>
          
          <h1 className="text-2xl neobrutalist-text">PHOTO SCATTER</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllPhotos}
              className="flex items-center gap-2 text-black hover:bg-red-500 hover:text-white transition-colors px-3 py-2 border-2 border-black neobrutalist-text"
            >
              <RotateCcw size={16} />
              CLEAR
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div 
        ref={containerRef}
        className="relative pt-20 min-h-screen overflow-hidden"
        style={{ cursor: draggedPhoto ? 'grabbing' : 'default' }}
      >
        {/* Generate Button */}
        {photos.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePhotos}
              className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-8 py-4 text-2xl neobrutalist-text transition-all"
            >
              GENERATE PHOTOS
            </motion.button>
          </div>
        )}

        {/* Photos */}
        <AnimatePresence>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                scale: photo.scale, 
                rotate: photo.rotation,
                x: photo.x,
                y: photo.y
              }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: Math.random() * 0.5 
              }}
              className="absolute border-4 border-black neobrutalist-shadow cursor-grab active:cursor-grabbing group"
              style={{ 
                zIndex: photo.zIndex,
                transformOrigin: 'center center'
              }}
              onMouseDown={(e) => handleMouseDown(photo.id, e)}
            >
              {/* Close Button */}
              <button
                onClick={() => closePhoto(photo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-2 border-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
              >
                <X size={12} />
              </button>
              
              {/* Photo */}
              <img
                src={photo.url}
                alt="Scattered photo"
                className="block w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
                onError={(e) => {
                  // Fallback to a solid color if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
                    parent.style.minWidth = '200px';
                    parent.style.minHeight = '200px';
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Instructions */}
        {photos.length > 0 && (
          <div className="fixed bottom-4 left-4 bg-white border-2 border-black p-4 neobrutalist-shadow">
            <p className="text-sm neobrutalist-text mb-2">INSTRUCTIONS:</p>
            <ul className="text-xs space-y-1">
              <li>• DRAG photos to move them around</li>
              <li>• HOVER over photos to see close button</li>
              <li>• CLICK X to remove individual photos</li>
              <li>• CLICK CLEAR to remove all photos</li>
            </ul>
          </div>
        )}

        {/* Photo Count */}
        {photos.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white border-2 border-black p-4 neobrutalist-shadow">
            <p className="text-sm neobrutalist-text">
              PHOTOS: {photos.length}
            </p>
          </div>
        )}

        {/* Generate More Button */}
        {photos.length > 0 && (
          <div className="fixed top-1/2 right-4 transform -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePhotos}
              className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-4 py-2 neobrutalist-text transition-all writing-mode-vertical"
              style={{ writingMode: 'vertical-rl' }}
            >
              GENERATE MORE
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoScatter;