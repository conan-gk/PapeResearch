import './Paper.css'; // Import the CSS file
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Paper() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar (ToC)
  const { id } = useParams(); // Extracts id from the URL to identify which paper to fetch from the API
  const [paperContent, setPaperContent] = useState(''); // State for paper content
  const [tableOfContents, setTableOfContents] = useState(''); // State for ToC content

  useEffect(() => {
    fetch(`http://localhost:3001/api/papers/${id}`)
      .then(res => res.json()) // Parse response as JSON
      .then(data => {
        setPaperContent(data.paperContent); // Set paper content
        setTableOfContents(data.tableOfContents); // Set ToC content
      });
  }, [id]);

  return (
    <div className="wrapper">

      {/* Sidebar for Table of Contents */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* <button className="toggle-button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? '>' : '<'} 
        </button> */}

        {!isSidebarCollapsed && (
          <div className="toc-content"> {/* Render ToC here */}
            <div dangerouslySetInnerHTML={{ __html: tableOfContents }} /> {/* ToC content */}
          </div>
        )}

        
      </div>



      {/* Main Paper Content */}
      <div className="paper-content">
        <div dangerouslySetInnerHTML={{ __html: paperContent }} /> {/* Paper content */}
      </div>

      {/* Placeholder for Figures Panel */}
      <div className="figpanel">
        <h3>Panel for Figures</h3>
        <p>Figures will be displayed here!</p>
      </div>

      {/* Placeholder for Sidepanel */}
      <div className="sidepanel">
        <h3>AI Chatbot</h3>
        <p>I will answer your questions!</p>
      </div>
    </div>
  );
}

export default Paper;
