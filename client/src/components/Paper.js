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
    <div className="wrapper"> {/* Container for Paper page */}

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
      <div class="figpanel">
        <div class="panel_header">
                <b>Related Figures</b><br/>
                Click to pin
        </div>
        <div id="colRelated" class="column">
        </div>
      </div>



      {/* Placeholder for Chatbot Sidepanel/drawer */}
      <div className="sidepanel">
        <h3>AI Chatbot</h3>
        <p>I will answer your questions!</p>
      </div>
      
    </div>
  );
}

export default Paper;
