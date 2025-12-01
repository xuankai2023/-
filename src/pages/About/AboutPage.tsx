import React from 'react';
import './About.css';
import ScrollImageGallery from '../../components/skipPhotos/ScrollImageGallery';
import Header from '../../components/Headerlogin/loginHeader';
const AboutPage: React.FC = () => {
    return (
        <div className="tiktok-about-page">
            {/* Navigation Bar */}
            <Header />

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