import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoProject {
  id: number;
  title: string;
  date: string;
  type: 'Photography' | 'Art Project';
  medium: 'Film' | 'Digital' | 'Acrylic' | 'Oil' | 'Mixed Media' | 'Watercolor';
  images: string[];
  slug: string;
}
import { useNavigate } from 'react-router-dom';

const PhotosGallery: React.FC = () => {
  const [projects, setProjects] = useState<PhotoProject[]>([]);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const navigate = useNavigate();

  // Sample photo projects data - easily editable
  const photoProjects: PhotoProject[] = [
    {
      id: 1,
      title: "Tokyo Street Life",
      date: "2025-01-15",
      type: "Photography",
      medium: "Film",
      images: [
        "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "tokyo-street-life"
    },
    {
      id: 2,
      title: "Urban Abstractions",
      date: "2025-01-12",
      type: "Art Project",
      medium: "Acrylic",
      images: [
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "urban-abstractions"
    },
    {
      id: 3,
      title: "Digital Landscapes",
      date: "2025-01-10",
      type: "Photography",
      medium: "Digital",
      images: [
        "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "digital-landscapes"
    },
    {
      id: 4,
      title: "Portrait Series",
      date: "2025-01-08",
      type: "Photography",
      medium: "Film",
      images: [
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "portrait-series"
    },
    {
      id: 5,
      title: "Color Studies",
      date: "2025-01-05",
      type: "Art Project",
      medium: "Oil",
      images: [
        "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "color-studies"
    },
    {
      id: 6,
      title: "Architectural Forms",
      date: "2025-01-03",
      type: "Photography",
      medium: "Digital",
      images: [
        "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "architectural-forms"
    },
    {
      id: 7,
      title: "Mixed Media Experiments",
      date: "2025-01-01",
      type: "Art Project",
      medium: "Mixed Media",
      images: [
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        "https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300"
      ],
      slug: "mixed-media-experiments"
    }
  ];

  useEffect(() => {
    // Sort projects by date (most recent first)
    const sortedProjects = [...photoProjects].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setProjects(sortedProjects);
  }, []);

  const handleProjectClick = (slug: string) => {
    console.log(`Navigating to project: ${slug}`);
    navigate(`/photos/${slug}`);
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

  const projectVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link 
            to="/home" 
            className="flex items-center gap-2 text-black hover:bg-black hover:text-white transition-colors px-3 py-2 border-2 border-black neobrutalist-text"
          >
            <ArrowLeft size={16} />
            BACK
          </Link>
          
          <h1 className="text-2xl neobrutalist-text">PHOTOS</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm neobrutalist-text">{projects.length} PROJECTS</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h2 className="text-6xl md:text-8xl neobrutalist-text mb-4">
              VISUAL WORK
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              A collection of photography and art projects exploring different mediums and techniques.
            </p>
          </section>

          {/* Projects Grid */}
          <section className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                custom={index}
                variants={projectVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="border-4 border-black neobrutalist-shadow bg-white cursor-pointer"
                onClick={() => handleProjectClick(project.slug)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Project Info - Left Side */}
                  <div className="lg:w-1/4 p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm neobrutalist-text text-gray-600 mb-1">DATE</p>
                        <p className="text-lg neobrutalist-text">
                          {new Date(project.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm neobrutalist-text text-gray-600 mb-1">TYPE</p>
                        <p className="text-lg neobrutalist-text">{project.type}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm neobrutalist-text text-gray-600 mb-1">MEDIUM</p>
                        <p className="text-lg neobrutalist-text">{project.medium}</p>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-2xl neobrutalist-text mb-2">{project.title}</h3>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredProject === project.id ? 1 : 0,
                            x: hoveredProject === project.id ? 0 : -10
                          }}
                          className="text-sm neobrutalist-text"
                        >
                          VIEW PROJECT →
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Images - Right Side */}
                  <div className="lg:w-3/4 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {project.images.map((image, imageIndex) => (
                        <motion.div
                          key={imageIndex}
                          variants={imageVariants}
                          whileHover="hover"
                          className="border-2 border-black overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Image ${imageIndex + 1}`}
                            className="w-full h-64 object-cover"
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
              </motion.div>
            ))}
          </section>

          {/* Stats Section */}
          <section className="mt-16 bg-gray-100 border-4 border-black p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl neobrutalist-text mb-2">
                  {projects.filter(p => p.type === 'Photography').length}
                </div>
                <div className="text-sm">PHOTOGRAPHY</div>
              </div>
              <div>
                <div className="text-3xl neobrutalist-text mb-2">
                  {projects.filter(p => p.type === 'Art Project').length}
                </div>
                <div className="text-sm">ART PROJECTS</div>
              </div>
              <div>
                <div className="text-3xl neobrutalist-text mb-2">
                  {projects.filter(p => p.medium === 'Film').length}
                </div>
                <div className="text-sm">FILM</div>
              </div>
              <div>
                <div className="text-3xl neobrutalist-text mb-2">
                  {projects.filter(p => p.medium === 'Digital').length}
                </div>
                <div className="text-sm">DIGITAL</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </motion.div>
  );
};

export default PhotosGallery;