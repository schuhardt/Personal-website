import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface PhotoPostData {
  id: string;
  title: string;
  date: string;
  type: 'Photography' | 'Art Project';
  medium: 'Film' | 'Digital' | 'Acrylic' | 'Oil' | 'Mixed Media' | 'Watercolor';
  description: string;
  images: string[];
  details: {
    location?: string;
    camera?: string;
    lens?: string;
    settings?: string;
    inspiration?: string;
  };
}

const PhotoPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
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

  const getPostData = (slug: string): PhotoPostData | null => {
    const posts: Record<string, PhotoPostData> = {
      'tokyo-street-life': {
        id: '1',
        title: 'Tokyo Street Life',
        date: '2025-01-15',
        type: 'Photography',
        medium: 'Film',
        description: 'A deep dive into the bustling streets of Tokyo, capturing the essence of urban life through the lens of analog photography. This series explores the intersection of tradition and modernity in one of the world\'s most dynamic cities. Each frame tells a story of human connection amidst the urban chaos, revealing moments of quiet beauty in the everyday rush of metropolitan life.',
        images: [
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          location: 'Tokyo, Japan',
          camera: 'Canon AE-1',
          lens: '50mm f/1.8',
          settings: 'Various, mostly f/2.8-f/5.6',
          inspiration: 'The energy and rhythm of Tokyo\'s streets during rush hour'
        }
      },
      'urban-abstractions': {
        id: '2',
        title: 'Urban Abstractions',
        date: '2025-01-12',
        type: 'Art Project',
        medium: 'Acrylic',
        description: 'An exploration of urban forms through abstract painting, translating the geometric patterns and color palettes of city architecture into expressive artworks. This series deconstructs the visual language of the modern city, finding beauty in concrete, steel, and glass through bold brushstrokes and dynamic compositions.',
        images: [
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          inspiration: 'Brutalist architecture and urban decay',
          location: 'Studio work'
        }
      },
      'digital-landscapes': {
        id: '3',
        title: 'Digital Landscapes',
        date: '2025-01-10',
        type: 'Photography',
        medium: 'Digital',
        description: 'Exploring the intersection of natural and digital worlds through landscape photography enhanced with digital techniques. This project questions the boundaries between reality and digital manipulation, creating dreamlike visions of familiar landscapes transformed through technology.',
        images: [
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          location: 'Various locations',
          camera: 'Canon EOS R5',
          lens: '24-70mm f/2.8',
          settings: 'f/8-f/11, ISO 100-400',
          inspiration: 'The relationship between technology and nature'
        }
      },
      'portrait-series': {
        id: '4',
        title: 'Portrait Series',
        date: '2025-01-08',
        type: 'Photography',
        medium: 'Film',
        description: 'An intimate portrait series capturing the essence of human emotion through analog photography. Each portrait reveals a moment of vulnerability and connection, exploring the depth of human experience through careful composition and natural lighting.',
        images: [
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          location: 'Studio and outdoor locations',
          camera: 'Mamiya RB67',
          lens: '127mm f/3.8',
          settings: 'f/5.6-f/8, Kodak Portra 400',
          inspiration: 'Human connection and vulnerability'
        }
      },
      'color-studies': {
        id: '5',
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
          location: 'Studio work'
        }
      },
      'architectural-forms': {
        id: '6',
        title: 'Architectural Forms',
        date: '2025-01-03',
        type: 'Photography',
        medium: 'Digital',
        description: 'A study of geometric forms and structural beauty in contemporary architecture. This project focuses on the interplay of light, shadow, and form in modern buildings, revealing the sculptural qualities inherent in architectural design.',
        images: [
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          location: 'Urban environments',
          camera: 'Sony A7R IV',
          lens: '16-35mm f/2.8',
          settings: 'f/8-f/11, ISO 100',
          inspiration: 'Brutalist and modernist architecture'
        }
      },
      'mixed-media-experiments': {
        id: '7',
        title: 'Mixed Media Experiments',
        date: '2025-01-01',
        type: 'Art Project',
        medium: 'Mixed Media',
        description: 'Experimental works combining traditional and digital media to explore new forms of artistic expression. This series pushes the boundaries between analog and digital art, creating hybrid works that question the nature of contemporary artistic practice.',
        images: [
          'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
          'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
        ],
        details: {
          inspiration: 'The intersection of analog and digital art',
          location: 'Studio work'
        }
      }
    };

    return posts[slug] || null;
  };

  const post = getPostData(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-medium mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project "{slug}" could not be found.</p>
          <Link 
            to="/photos" 
            className="inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-medium transition-all hover:bg-black hover:text-white"
          >
            <ArrowLeft size={16} />
            BACK TO PHOTOS
          </Link>
        </div>
      </div>
    );
  }

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
                <div>{new Date(post.date).getFullYear()}</div>
                <div>{post.type} Journal</div>
                <div>{post.medium} / Digital</div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-medium mb-8">{post.title}</h1>
                
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
                {post.description}
              </p>
              
              {/* Project Details */}
              <div className="space-y-4 text-sm">
                {post.details.location && (
                  <div>
                    <span className="font-medium">Location:</span>
                    <br />
                    {post.details.location}
                  </div>
                )}
                {post.details.camera && (
                  <div>
                    <span className="font-medium">Camera:</span>
                    <br />
                    {post.details.camera}
                  </div>
                )}
                {post.details.lens && (
                  <div>
                    <span className="font-medium">Lens:</span>
                    <br />
                    {post.details.lens}
                  </div>
                )}
                {post.details.settings && (
                  <div>
                    <span className="font-medium">Settings:</span>
                    <br />
                    {post.details.settings}
                  </div>
                )}
                {post.details.inspiration && (
                  <div>
                    <span className="font-medium">Inspiration:</span>
                    <br />
                    {post.details.inspiration}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Images Grid - No Gaps */}
          <div className="col-span-9">
            <div className="space-y-0">
              {post.images.map((image, index) => (
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
                    alt={`${post.title} - Image ${index + 1}`}
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

export default PhotoPost;