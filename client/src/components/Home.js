// Home.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure to create this CSS file for styling
import homebookIcon from '../assets/icons/homebook.svg';
import cbIcon from '../assets/icons/cb.svg';
import lightningIcon from '../assets/icons/lightning.svg';


function Home() {
    const [searchQuery, setSearchQuery] = useState(''); // State to handle the search input
    const navigate = useNavigate();

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Function to handle Enter key press for search
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/papers?search=${encodeURIComponent(searchQuery)}`); // Redirect to PapersList with search query
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/papers?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="home">
            <div className="home-content">
                <h1 className="home-title">Explore Scientific Papers with Interactive Displays</h1>
                <p className="home-subtitle">
                    Discover research through dynamic figure interactions and AI-assisted reading, all within a seamless and intuitive experience.
                </p>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search papers..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        className="search-input"
                    />
                    <button onClick={handleSearchSubmit} className="search-button">Search</button>
                </div>

                <div className="features">
                    <div className="feature-item">
                        <div className="icon-circle">
                            <img src={homebookIcon} alt="Interactive Paper Display" className="feature-icon" />
                        </div>
                        <h3>Interactive Paper Display</h3>
                        <p>Engage with research figures and data interactively.</p>
                    </div>
                    <div className="feature-item">
                        <div className="icon-circle">
                            <img src={cbIcon} alt="AI Research Assistant" className="feature-icon" />
                        </div>
                        <h3>AI Research Assistant</h3>
                        <p>Get intelligent insights and summaries as you read.</p>
                    </div>
                    <div className="feature-item">
                        <div className="icon-circle">
                            <img src={lightningIcon} alt="Intuitive Reading Experience" className="feature-icon" />
                        </div>
                        <h3>Intuitive Reading Experience</h3>
                        <p>Enjoy a clean, distraction-free interface designed for focus.</p>
                    </div>
                </div>

                <Link to="/papers" className="explore-button">
                    Start Exploring Papers
                </Link>
            </div>
        </div>
    );
}

export default Home;
