import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const ColorStudies: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Update Frankfurt time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const frankfurtTime = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Berlin',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(frankfurtTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const projectData = {
    title: 'Color Studies',
    date: '2025-01-05',
    type: 'Art Project',
    medium: 'Oil',
    description: 'An exploration of color theory and emotional expression through oil painting. This series investigates how different color combinations can evoke specific emotional responses, using traditional painting techniques to create contemporary expressions of feeling and mood.',
    images: [
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
    ],
    details: {
      inspiration: 'Color psychology and emotional resonance',
      location: 'Studio work',
      medium: 'Oil on canvas',
      dimensions: '16x20" to 30x40"',
      technique: 'Alla prima and glazing techniques'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-lg font-medium">Creative Communion Blog :</h1>
              <h2 className="text-lg font-medium">IWWMS</h2>
              <h3 className="text-lg font-medium">Clothing Commute</h3>
            </div>
            
            <nav className="flex flex-col gap-1 text-gray-600">
              <Link to="/photos" className="hover:text-black transition-colors">Projects</Link>
              <span>About</span>
              <span>Notes</span>
              <span>Contact</span>
              <span>(Dark Mode)</span>
            </nav>
          </div>
          
          <div className="text-right">
            <span className="text-sm">{currentTime}, Frankfurt</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="col-span-2">
              <div className="space-y-2 text-sm">
                <div>{new Date(projectData.date).getFullYear()}</div>
                <div>{projectData.type} Journal</div>
                <div>{projectData.medium} / Digital</div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-medium mb-8">{projectData.title}</h1>
                
                {/* Scroll Down Indicator */}
                <motion.div 
                  className="flex items-center gap-2 text-gray-600"
                  style={{ opacity: scrollIndicatorOpacity }}
                >
                  <span className="text-sm">Scroll down</span>
                  <ChevronDown size={16} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto p-6 pt-0">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Description Block */}
          <motion.div 
            className="col-span-3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="sticky top-20">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                {projectData.description}
              </p>
              
              {/* Project Details */}
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium">Inspiration:</span>
                  <br />
                  {projectData.details.inspiration}
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <br />
                  {projectData.details.location}
                </div>
                <div>
                  <span className="font-medium">Medium:</span>
                  <br />
                  {projectData.details.medium}
                </div>
                <div>
                  <span className="font-medium">Dimensions:</span>
                  <br />
                  {projectData.details.dimensions}
                </div>
                <div>
                  <span className="font-medium">Technique:</span>
                  <br />
                  {projectData.details.technique}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Images Grid - No Gaps */}
          <div className="col-span-9">
            <div className="space-y-0">
              {projectData.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-full cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${projectData.title} - Image ${index + 1}`}
                    className="w-full h-auto object-cover hover:opacity-90 transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorStudies;