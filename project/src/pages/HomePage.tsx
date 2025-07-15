import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Heart, ShoppingBag, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const HomePage: React.FC = () => {
  const [hoveredName, setHoveredName] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const navigate = useNavigate();

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

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sample data - easily editable
  const allPhotos = [
    { id: 1, title: "Tokyo Street Life", date: "2025-01-15", thumbnail: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=300&h=200", slug: "tokyo-street-life" },
    { id: 2, title: "Urban Abstractions", date: "2025-01-12", thumbnail: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300&h=200", slug: "urban-abstractions" },
    { id: 3, title: "Digital Landscapes", date: "2025-01-10", thumbnail: "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=300&h=200", slug: "digital-landscapes" },
    { id: 4, title: "Portrait Series", date: "2025-01-08", thumbnail: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=300&h=200", slug: "portrait-series" },
    { id: 5, title: "Color Studies", date: "2025-01-05", thumbnail: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=300&h=200", slug: "color-studies" }
  ];

  const allThoughts = [
    { id: 1, title: "On Digital Minimalism", date: "2025-01-14", preview: "Exploring the balance between technology and mindful living...", slug: "digital-minimalism" },
    { id: 2, title: "Creative Process Notes", date: "2025-01-11", preview: "Some thoughts on maintaining creativity in a structured world...", slug: "creative-process-notes" },
    { id: 3, title: "Travel Reflections", date: "2025-01-09", preview: "What I learned from my recent journey through Japan...", slug: "travel-reflections" },
    { id: 4, title: "Design Philosophy", date: "2025-01-06", preview: "Why I believe in the power of neobrutalist design...", slug: "design-philosophy" },
    { id: 5, title: "Technology Ethics", date: "2025-01-03", preview: "Thoughts on responsible technology development...", slug: "technology-ethics" }
  ];

  const allLikes = [
    { id: 1, title: "Dieter Rams: Ten Principles", date: "2025-01-13", type: "Article", source: "Design Museum", slug: "dieter-rams-principles" },
    { id: 2, title: "Brutalist Architecture", date: "2025-01-10", type: "Photo Series", source: "Architectural Digest", slug: "brutalist-architecture" },
    { id: 3, title: "Minimal Techno Mix", date: "2025-01-07", type: "Music", source: "SoundCloud", slug: "minimal-techno-mix" },
    { id: 4, title: "Typography in Web Design", date: "2025-01-05", type: "Video", source: "YouTube", slug: "typography-web-design" },
    { id: 5, title: "Sustainable Design", date: "2025-01-02", type: "Article", source: "Medium", slug: "sustainable-design" }
  ];

  // Get 3 most recent items from each category
  const recentPhotos = allPhotos.slice(0, 3);
  const recentThoughts = allThoughts.slice(0, 3);
  const recentLikes = allLikes.slice(0, 3);

  // Social media links - easily editable
  const socialLinks = [
    { name: "Instagram", url: "https://instagram.com/alexanderschuhardt", icon: "📷" },
    { name: "Twitter", url: "https://twitter.com/alexanderschuhardt", icon: "🐦" },
    { name: "LinkedIn", url: "https://linkedin.com/in/alexanderschuhardt", icon: "💼" },
    { name: "GitHub", url: "https://github.com/alexanderschuhardt", icon: "💻" },
    { name: "Email", url: "mailto:alexander@schuhardt.com", icon: "✉️" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const glitchVariants = {
    normal: { x: 0 },
    glitch: {
      x: [-2, 2, -1, 1, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const handlePostClick = (type: string, slug: string) => {
    // Navigate to individual post pages
    if (type === 'photo') {
      navigate(`/photos/${slug}`);
    } else if (type === 'thought') {
      navigate(`/thoughts/${slug}`);
    } else if (type === 'like') {
      navigate(`/likes/${slug}`);
    }
  };

  // Animation variants for posts
  const postVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const moduleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white text-black"
    >
      {/* Header */}
      <motion.header 
        variants={itemVariants}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black p-4"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-black hover:bg-black hover:text-white transition-colors px-3 py-2 border-2 border-black neobrutalist-text"
          >
            <ArrowLeft size={16} />
            BACK
          </Link>
          
          <motion.h1 
            className="text-2xl neobrutalist-text cursor-pointer"
            onMouseEnter={() => setHoveredName(true)}
            onMouseLeave={() => setHoveredName(false)}
            onClick={() => setShowAboutModal(true)}
            variants={glitchVariants}
            animate={hoveredName ? "glitch" : "normal"}
          >
            {hoveredName ? "ALEXANDER SCHUHARDT" : "ABOUT ME"}
          </motion.h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm neobrutalist-text">{currentTime} FRANKFURT</span>
            <div className="w-3 h-3 bg-green-500 border-2 border-black"></div>
          </div>
        </div>
      </motion.header>

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAboutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border-4 border-black neobrutalist-shadow max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl neobrutalist-text">ALEXANDER SCHUHARDT</h2>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div className="border-4 border-black">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=500"
                    alt="Alexander Schuhardt"
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <p className="mb-4 text-sm leading-relaxed">
                    Creative technologist and designer passionate about the intersection of art, technology, and human experience. 
                    I create digital experiences that challenge conventional thinking and push the boundaries of what's possible.
                  </p>
                  <p className="mb-6 text-sm leading-relaxed">
                    Currently exploring neobrutalist design, interactive media, and the philosophy of digital minimalism.
                  </p>
                  
                  {/* Social Links */}
                  <div className="space-y-2">
                    <h3 className="neobrutalist-text text-sm mb-3">CONNECT WITH ME:</h3>
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm"
                      >
                        <span>{link.icon}</span>
                        <span className="neobrutalist-text">{link.name}</span>
                        <ExternalLink size={12} className="ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="mb-16 text-center">
            <h2 className="text-6xl md:text-8xl neobrutalist-text mb-4">
              PORTFOLIO
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Welcome to my digital space. Here I share my thoughts, photos, and things I find interesting.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm neobrutalist-text">
              <span>LAST UPDATED: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>VERSION 1.0</span>
            </div>
          </motion.section>

          {/* Navigation Grid */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Photos Module */}
            <motion.div 
              variants={moduleVariants}
              className="bg-white border-4 border-black neobrutalist-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    to="/photos"
                    className="text-xs neobrutalist-text border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <h3 className="text-xl neobrutalist-text mb-2">PHOTOS</h3>
                <p className="text-sm mb-2">Visual stories and moments</p>
                <div className="text-xs neobrutalist-text text-gray-600">[RECENT]</div>
              </div>
              
              <div className="border-t-4 border-black">
                <div className="p-4 space-y-0">
                  {recentPhotos.map((photo, index) => (
                    <motion.div 
                      key={photo.id}
                      custom={index}
                      variants={postVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 -m-2 transition-colors"
                      onClick={() => navigate(`/photos/${photo.slug}`)}
                      onMouseEnter={() => setHoveredPost(`photo-${photo.id}`)}
                      onMouseLeave={() => setHoveredPost(null)}
                    >
                      <Link to={`/projects/${photo.slug}`} className="flex gap-3 items-center w-full">
                        <motion.img 
                          src={photo.thumbnail} 
                          alt={photo.title}
                          className="w-12 h-12 object-cover border-2 border-black"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs neobrutalist-text truncate">{photo.title}</p>
                          <p className="text-xs text-gray-600">{photo.date}</p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredPost === `photo-${photo.id}` ? 1 : 0,
                            x: hoveredPost === `photo-${photo.id}` ? 0 : -10
                          }}
                          className="text-xs neobrutalist-text"
                        >
                          →
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Thoughts Module */}
            <motion.div 
              variants={moduleVariants}
              className="bg-white border-4 border-black neobrutalist-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs neobrutalist-text border border-black px-2 py-1 text-gray-400">
                    COMING SOON
                  </div>
                </div>
                <h3 className="text-xl neobrutalist-text mb-2">THOUGHTS</h3>
                <p className="text-sm mb-2">Ideas and reflections</p>
                <div className="text-xs neobrutalist-text text-gray-600">[RECENT]</div>
              </div>
              
              <div className="border-t-4 border-black">
                <div className="p-4 space-y-0">
                  {recentThoughts.map((thought, index) => (
                    <motion.div 
                      key={thought.id}
                      custom={index}
                      variants={postVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="border-b border-gray-200 last:border-b-0 pb-2 last:pb-0 cursor-pointer hover:bg-gray-100 p-2 -m-2 transition-colors"
                      onClick={() => handlePostClick('thought', thought.slug)}
                      onMouseEnter={() => setHoveredPost(`thought-${thought.id}`)}
                      onMouseLeave={() => setHoveredPost(null)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs neobrutalist-text mb-1">{thought.title}</p>
                          <p className="text-xs text-gray-600 mb-1">{thought.preview}</p>
                          <p className="text-xs text-gray-500">{thought.date}</p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredPost === `thought-${thought.id}` ? 1 : 0,
                            x: hoveredPost === `thought-${thought.id}` ? 0 : -10
                          }}
                          className="text-xs neobrutalist-text ml-2"
                        >
                          →
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Likes Module */}
            <motion.div 
              variants={moduleVariants}
              className="bg-white border-4 border-black neobrutalist-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs neobrutalist-text border border-black px-2 py-1 text-gray-400">
                    COMING SOON
                  </div>
                </div>
                <h3 className="text-xl neobrutalist-text mb-2">LIKES</h3>
                <p className="text-sm mb-2">Content I find interesting</p>
                <div className="text-xs neobrutalist-text text-gray-600">[RECENT]</div>
              </div>
              
              <div className="border-t-4 border-black">
                <div className="p-4 space-y-0">
                  {recentLikes.map((like, index) => (
                    <motion.div 
                      key={like.id}
                      custom={index}
                      variants={postVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="border-b border-gray-200 last:border-b-0 pb-2 last:pb-0 cursor-pointer hover:bg-gray-100 p-2 -m-2 transition-colors"
                      onClick={() => handlePostClick('like', like.slug)}
                      onMouseEnter={() => setHoveredPost(`like-${like.id}`)}
                      onMouseLeave={() => setHoveredPost(null)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs neobrutalist-text flex-1">{like.title}</p>
                            <span className="text-xs bg-gray-100 px-1 border border-black ml-2">{like.type}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{like.source}</p>
                          <p className="text-xs text-gray-500">{like.date}</p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredPost === `like-${like.id}` ? 1 : 0,
                            x: hoveredPost === `like-${like.id}` ? 0 : -10
                          }}
                          className="text-xs neobrutalist-text ml-2"
                        >
                          →
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Store Module */}
            <motion.div 
              variants={moduleVariants}
              className="bg-white border-4 border-black neobrutalist-shadow"
            >
              <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs neobrutalist-text border border-black px-2 py-1 text-gray-400">
                    COMING SOON
                  </div>
                </div>
                <h3 className="text-xl neobrutalist-text mb-2">STORE</h3>
                <p className="text-sm mb-2">Digital products and prints</p>
                <div className="text-xs neobrutalist-text text-gray-600">
                  [LINK]
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Stats Section */}
          <motion.section variants={itemVariants} className="bg-gray-100 border-4 border-black p-8 mb-16">
            <h3 className="text-2xl neobrutalist-text mb-6">SITE STATS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl neobrutalist-text mb-2">{allPhotos.length}</div>
                <div className="text-sm">PHOTOS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl neobrutalist-text mb-2">{allThoughts.length}</div>
                <div className="text-sm">THOUGHTS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl neobrutalist-text mb-2">{allLikes.length}</div>
                <div className="text-sm">LIKES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl neobrutalist-text mb-2">1</div>
                <div className="text-sm">VISITORS</div>
              </div>
            </div>
          </motion.section>

          {/* Quick Edit Section */}
          <motion.section variants={itemVariants} className="bg-yellow-100 border-4 border-black p-8">
            <h3 className="text-2xl neobrutalist-text mb-4">QUICK EDIT</h3>
            <p className="mb-4">
              This section is designed for easy content management. All text, images, and sections can be easily updated.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white border-2 border-black px-4 py-2 neobrutalist-text hover:bg-black hover:text-white transition-colors">
                EDIT CONTENT
              </button>
              <button className="bg-white border-2 border-black px-4 py-2 neobrutalist-text hover:bg-black hover:text-white transition-colors">
                ADD PHOTOS
              </button>
              <button className="bg-white border-2 border-black px-4 py-2 neobrutalist-text hover:bg-black hover:text-white transition-colors">
                UPDATE INFO
              </button>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <motion.footer variants={itemVariants} className="border-t-4 border-black bg-white p-8 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="neobrutalist-text mb-2">BUILT WITH PASSION</p>
          <p className="text-sm text-gray-600">
            © 2025 ALEXANDER SCHUHARDT • DESIGNED FOR EASY EDITING • VERSION 1.0
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default HomePage;