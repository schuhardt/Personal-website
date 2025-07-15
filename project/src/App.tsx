import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import PhotoScatter from './pages/PhotoScatter';
import PhotosGallery from './pages/PhotosGallery';
import PhotoPost from './pages/PhotoPost';
import ThoughtPost from './pages/ThoughtPost';
import LikePost from './pages/LikePost';

// Individual project pages
import TokyoStreetLife from './pages/projects/TokyoStreetLife';
import UrbanAbstractions from './pages/projects/UrbanAbstractions';
import DigitalLandscapes from './pages/projects/DigitalLandscapes';
import PortraitSeries from './pages/projects/PortraitSeries';
import ColorStudies from './pages/projects/ColorStudies';
import ArchitecturalForms from './pages/projects/ArchitecturalForms';
import MixedMediaExperiments from './pages/projects/MixedMediaExperiments';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/photos" element={<PhotosGallery />} />
          <Route path="/photos/:slug" element={<PhotoPost />} />
          
          {/* Individual project routes */}
          <Route path="/projects/tokyo-street-life" element={<TokyoStreetLife />} />
          <Route path="/projects/urban-abstractions" element={<UrbanAbstractions />} />
          <Route path="/projects/digital-landscapes" element={<DigitalLandscapes />} />
          <Route path="/projects/portrait-series" element={<PortraitSeries />} />
          <Route path="/projects/color-studies" element={<ColorStudies />} />
          <Route path="/projects/architectural-forms" element={<ArchitecturalForms />} />
          <Route path="/projects/mixed-media-experiments" element={<MixedMediaExperiments />} />
          
          <Route path="/thoughts/:slug" element={<ThoughtPost />} />
          <Route path="/likes/:slug" element={<LikePost />} />
          <Route path="/scatter" element={<PhotoScatter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;