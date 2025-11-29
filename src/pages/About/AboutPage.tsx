import React from 'react';
import './About.css';
import ScrollImageGallery from '../../components/skipPhotos/ScrollImageGallery';
const AboutPage: React.FC = () => {
    return (
        <div className="tiktok-about-page">
            {/* Navigation Bar */}
            <nav className="tiktok-nav">
                <div className="nav-container">
                    <div className="nav-left">
                        <div className="tiktok-logo">
                            <span className="logo-icon">♪</span>
                            <span className="logo-text">TikTok</span>
                        </div>
                    </div>
                    <div className="nav-center">
                        <a href="#" className="nav-link active">About</a>
                        <a href="#" className="nav-link">Newsroom</a>
                        <a href="#" className="nav-link">Careers</a>
                        <a href="#" className="nav-link">Contact</a>
                    </div>
                    <div className="nav-right">
                        <a href="#" className="watch-button">Watch TikTok →</a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-container">
                    <div className="text-section">
                        <h1 className="mission-title">Our mission is to inspire creativity and bring joy.</h1>
                        <p className="mission-description">
                            TikTok's global headquarters are in Los Angeles and Singapore, and its offices include New York, London, Dublin, Paris, Berlin, Dubai, Jakarta, Seoul, and Tokyo.
                        </p>
                    </div>
                    
                </div>
                <div className="image-grid">
                       <ScrollImageGallery />
                        
                    </div>
            </main>
        </div>
    );
};

export default AboutPage;