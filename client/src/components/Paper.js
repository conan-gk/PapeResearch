import './Paper.css'; // Import the CSS file
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FigurePanel from './FigurePanel'; // Import the FigurePanel component

function Paper() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar (ToC)
  const { id } = useParams(); // Extracts id from the URL to identify which paper to fetch from the API
  const [paperContent, setPaperContent] = useState(''); // State for paper content
  const [tableOfContents, setTableOfContents] = useState(''); // State for ToC content
  const [figures, setFigures] = useState([]); // State for figures

  useEffect(() => {
    fetch(`http://localhost:3001/api/papers/${id}`)
      .then(res => res.json()) // Parse response as JSON
      .then(data => {
        console.log('Fetched data:', data); // Log all fetched data
        console.log('Fetched figures:', data.figures); // Log the figures

        // Optional: Check if any figures are undefined or malformed
        if (data.figures.some(fig => !fig.imgSrc)) {
          console.error('Error: Some figures are missing imgSrc:', data.figures);
        }

        setPaperContent(data.paperContent); // Set paper content
        setTableOfContents(data.tableOfContents); // Set ToC content
        setFigures(data.figures || []); // Set figures
      })
      .catch(err => console.error('Error fetching paper data:', err)); // Catch and log any errors
  }, [id]);

  return (
    <div className="wrapper">
      {/* Sidebar for Table of Contents */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Toggle Button */}
        <button 
          className="toggle-button" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? '>>' : '<<'}
        </button>
        {/* If sidebar expanded, render ToC */}
        {!isSidebarCollapsed && (
          <div className="toc-content">
            <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
          </div>
        )}
      </div>

      {/* Main Paper Content */}
      <div className="paper-content">
        <div dangerouslySetInnerHTML={{ __html: paperContent }} />
      </div>

      {/* Render the FigurePanel component with all figures */}
      <FigurePanel figures={figures} />

    </div>
  );
}

export default Paper;
