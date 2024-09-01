// PapersList.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to read URL params
import './PapersList.css';

function PapersList() {
    const [papers, setPapers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [searchResults, setSearchResults] = useState([]); // State for search results

    const location = useLocation(); // Get the location object to access query parameters

    // Fetch the list of papers from the API
    useEffect(() => {
        fetch('http://localhost:3001/api/papers')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched papers:", data);
                setPapers(data);
                setSearchResults(data); // Initially display all papers

                // Check for search query from URL parameters
                const params = new URLSearchParams(location.search);
                const query = params.get('search'); // Get the search parameter from the URL
                if (query) {
                    setSearchQuery(query);
                    filterPapers(query, data); // Filter papers based on the URL query
                }
            });
    }, [location.search]);

    // Function to handle search input changes
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Function to filter papers based on search query
    const filterPapers = (query, papersList) => {
        if (!query) {
            setSearchResults(papersList); // If input is empty, show all papers
            return;
        }

        const filteredResults = papersList.filter(paper =>
            paper.title.toLowerCase().includes(query.toLowerCase()) ||
            paper.authors.some(author => author.toLowerCase().includes(query.toLowerCase())) ||
            (paper.journal && paper.journal.toLowerCase().includes(query.toLowerCase()))
        );
        setSearchResults(filteredResults);
    };

    // Function to handle key down event, triggering search on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            filterPapers(searchQuery, papers);
        }
    };

    return (
        <div className='paperlist-wrapper'>
            <div className="papers-list">
                <h1>Browse our collection of scientific papers</h1>
                <h2 className="subheading">
                    Explore research with dynamic figure interactions and an AI research assistant, all within a seamless and intuitive reading experience.
                </h2>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search papers by title, author, or journal"
                        value={searchQuery}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown} // Listen for key presses
                    />
                    <button onClick={() => filterPapers(searchQuery, papers)}>Search</button>
                </div>

                {/* Display search results */}
                <div className="paper-cards">
                    {searchResults.map(paper => (
                        <div className="paper-card" key={paper._id}>
                            <Link to={`/paper/${paper._id}`} className="paper-title">
                                {paper.title}
                            </Link>
                            <p className="paper-authors">{paper.authors.join(', ')}</p>
                            {paper.year !== 0 && <p className="paper-year">{paper.year}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>    
    );
}

export default PapersList;
