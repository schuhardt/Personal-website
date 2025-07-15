import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThoughtPostData {
  id: string;
  title: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
}

const ThoughtPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const getPostData = (slug: string): ThoughtPostData | null => {
    const posts: Record<string, ThoughtPostData> = {
      'digital-minimalism': {
        id: '1',
        title: 'On Digital Minimalism',
        date: '2025-01-14',
        readTime: '5 min read',
        content: `Digital minimalism isn't about rejecting technology entirely—it's about being intentional with how we engage with it. In our hyperconnected world, we've lost the ability to be bored, to sit with our thoughts, to engage deeply with single tasks.

The philosophy of digital minimalism suggests that we should approach our digital lives with the same intentionality we bring to other areas of life. Just as we might carefully curate our physical possessions, we should be deliberate about which digital tools we allow into our lives and how we use them.

This doesn't mean becoming a digital hermit. Instead, it means asking hard questions: Does this app, this notification, this digital habit serve my values and goals? Or is it simply a distraction that pulls me away from what matters most?

The goal isn't to use less technology for its own sake, but to use technology in ways that support our human flourishing rather than diminish it.`,
        tags: ['Technology', 'Philosophy', 'Lifestyle']
      },
      'creative-process-notes': {
        id: '2',
        title: 'Creative Process Notes',
        date: '2025-01-11',
        readTime: '3 min read',
        content: `Creativity isn't a mystical force that strikes randomly—it's a practice that can be cultivated and refined. Through years of creative work, I've learned that the most important aspect of creativity isn't inspiration, but consistency.

The creative process thrives on constraints. When we have infinite possibilities, we often become paralyzed by choice. But when we impose limitations—whether it's a specific color palette, a time constraint, or a particular medium—we force ourselves to be more inventive within those boundaries.

Another crucial element is embracing failure as part of the process. Every "failed" attempt teaches us something valuable about what doesn't work, bringing us closer to what does. The key is to fail quickly and learn from each iteration.

Finally, creativity requires both focused work and periods of rest. Our brains need time to process and make connections between disparate ideas. Some of my best insights come not during intense work sessions, but during walks, showers, or other moments of mental downtime.`,
        tags: ['Creativity', 'Process', 'Art']
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
  }

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
          
          <h1 className="text-xl neobrutalist-text">THOUGHTS</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm neobrutalist-text">{post.readTime.toUpperCase()}</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="bg-gray-100 border-4 border-black p-8 neobrutalist-shadow">
              <h1 className="text-4xl md:text-6xl neobrutalist-text mb-6">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-lg neobrutalist-text">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-lg neobrutalist-text">•</span>
                <span className="text-lg neobrutalist-text">{post.readTime}</span>
              </div>

              <div className="flex flex-wrap gap-2">
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
          </motion.section>

          {/* Article Content */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="bg-white border-4 border-black p-8 neobrutalist-shadow">
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Navigation */}
          <motion.section variants={itemVariants} className="border-t-4 border-black bg-gray-100 p-8">
            <div className="flex justify-between items-center">
              <Link 
                to="/home" 
                className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all"
              >
                ← ALL THOUGHTS
              </Link>
              
              <div className="text-center">
                <p className="neobrutalist-text text-sm text-gray-600">THOUGHT</p>
                <p className="neobrutalist-text">{post.id} OF MANY</p>
              </div>
              
              <button 
                className="bg-white border-4 border-black neobrutalist-shadow hover:neobrutalist-shadow-hover px-6 py-3 neobrutalist-text transition-all opacity-50 cursor-not-allowed"
                disabled
              >
                NEXT THOUGHT →
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  );
};

export default ThoughtPost;