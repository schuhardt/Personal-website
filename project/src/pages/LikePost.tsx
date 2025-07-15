import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface LikePostData {
  id: string;
  title: string;
  date: string;
  type: 'Article' | 'Photo Series' | 'Music' | 'Video' | 'Book' | 'Website';
  source: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail?: string;
}

const LikePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const getPostData = (slug: string): LikePostData | null => {
    const posts: Record<string, LikePostData> = {
      'dieter-rams-principles': {
        id: '1',
        title: 'Dieter Rams: Ten Principles',
        date: '2025-01-13',
        type: 'Article',
        source: 'Design Museum',
        url: 'https://designmuseum.org/discover-design/all-stories/dieter-rams-ten-principles-good-design',
        description: 'Dieter Rams\' ten principles for good design remain as relevant today as when they were first articulated. These principles have influenced countless designers and continue to shape how we think about creating meaningful, functional objects and experiences.',
        tags: ['Design', 'Philosophy', 'Industrial Design'],
        thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      },
      'brutalist-architecture': {
        id: '2',
        title: 'Brutalist Architecture',
        date: '2025-01-10',
        type: 'Photo Series',
        source: 'Architectural Digest',
        url: 'https://architecturaldigest.com',
        description: 'A stunning photo series exploring the raw concrete forms and bold geometric shapes of brutalist architecture. These buildings, often controversial, represent a fascinating period in architectural history where function and form merged in dramatic ways.',
        tags: ['Architecture', 'Photography', 'Brutalism'],
        thumbnail: 'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      },
      'minimal-techno-mix': {
        id: '3',
        title: 'Minimal Techno Mix',
        date: '2025-01-07',
        type: 'Music',
        source: 'SoundCloud',
        url: 'https://soundcloud.com',
        description: 'A carefully curated mix of minimal techno that explores the hypnotic rhythms and subtle progressions that define the genre. Perfect for focused work or contemplative listening.',
        tags: ['Music', 'Techno', 'Electronic'],
        thumbnail: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      }
    };

    return posts[slug] || null;
  };

  const post = getPostData(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl neobrutalist-text mb-4">POST NOT FOUND</h1>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2 bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link 
            to="/home" 
            className="flex items-center gap-2 text-black hover:bg-black hover:text-white transition-colors px-3 py-2 border-2 border-black neobrutalist-text"
          >
            <ArrowLeft size={16} />
            BACK
          </Link>
          
          <h1 className="text-xl neobrutalist-text">LIKES</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm neobrutalist-text">{post.type.toUpperCase()}</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="bg-gray-100 border-4 border-black p-8 neobrutalist-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-6xl neobrutalist-text mb-4">{post.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-lg neobrutalist-text">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-lg neobrutalist-text">•</span>
                    <span className="text-lg neobrutalist-text">{post.source}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-white border-2 border-black px-3 py-1 text-sm neobrutalist-text"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-6">
                  <span className="bg-black text-white px-4 py-2 neobrutalist-text text-sm">
                    {post.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all"
              >
                VIEW ORIGINAL
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.section>

          {/* Content */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="lg:col-span-1">
                  <div className="border-4 border-black neobrutalist-shadow">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-64 lg:h-80 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className={post.thumbnail ? "lg:col-span-2" : "lg:col-span-3"}>
                <div className="bg-white border-4 border-black p-6 neobrutalist-shadow h-full">
                  <h3 className="text-xl neobrutalist-text mb-4">WHY I LIKE THIS</h3>
                  <p className="text-lg leading-relaxed">{post.description}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="bg-yellow-100 border-4 border-black p-8 neobrutalist-shadow text-center">
              <h3 className="text-2xl neobrutalist-text mb-4">EXPLORE THE ORIGINAL</h3>
              <p className="text-lg mb-6">
                This content originally appeared on {post.source}. Click below to view the full piece.
              </p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-8 py-4 neobrutalist-text transition-all text-lg"
              >
                VISIT {post.source.toUpperCase()}
                <ExternalLink size={20} />
              </a>
            </div>
          </motion.section>

          {/* Navigation */}
          <motion.section variants={itemVariants} className="border-t-4 border-black bg-gray-100 p-8">
            <div className="flex justify-between items-center">
              <Link 
                to="/home" 
                className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all"
              >
                ← ALL LIKES
              </Link>
              
              <div className="text-center">
                <p className="neobrutalist-text text-sm text-gray-600">LIKE</p>
                <p className="neobrutalist-text">{post.id} OF MANY</p>
              </div>
              
              <button 
                className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all opacity-50 cursor-not-allowed"
                disabled
              >
                NEXT LIKE →
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  );
};

export default LikePost;