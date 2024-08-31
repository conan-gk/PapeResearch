import './Paper.css'; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FigurePanel from './FigurePanel'; 
import Chatbot from './Chatbot';

function Paper() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapsibility
  const { id } = useParams(); // Extracts id from URL to identify which paper to fetch from the API
  const [paperContent, setPaperContent] = useState(''); // State for paper content
  const [tableOfContents, setTableOfContents] = useState(''); // State for ToC content
  const [figures, setFigures] = useState([]); // State for figures
  const [visibleFigureIds, setVisibleFigureIds] = useState([]); // State for currently visible figures in FigurePanel

  useEffect(() => {
    fetch(`http://localhost:3001/api/papers/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data); // Log all fetched data
        console.log('Fetched figures:', data.figures); // Log the figures

        if (data.figures.some(fig => !fig.imgSrc)) {
          console.error('Error: Some figures are missing imgSrc:', data.figures);
        }

        setPaperContent(data.paperContent); // Set paper content
        setTableOfContents(data.tableOfContents); // Set ToC content
        setFigures(data.figures || []); // Set figures
      })
      .catch(err => console.error('Error fetching paper data:', err)); // Catch and log any errors
  }, [id]);

  useEffect(() => {
    if (!paperContent) return; // Wait for paper content to load

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const figureId = entry.target.getAttribute('data-figure-id'); // Get the figure ID
        if (entry.isIntersecting) {
          // Add figureId to visibleFigureIds if it is intersecting
          setVisibleFigureIds(prevIds => [...new Set([...prevIds, figureId])]);
        } else {
          // Remove figureId from visibleFigureIds if it is not intersecting
          setVisibleFigureIds(prevIds => prevIds.filter(id => id !== figureId));
        }
      });
    }, { threshold: 0.5 }); // Triggers when 50% of the target element is visible in the viewport

    // Find all figcaption elements with the 'data-figure-id' attribute and observe them
    const figCaptions = document.querySelectorAll('figcaption[data-figure-id]');
    figCaptions.forEach((figCaption) => {
      observer.observe(figCaption);
    });

    return () => {
      observer.disconnect();
    };
  }, [paperContent]);

  useEffect(() => {
    // Handle click event for captions to reveal figures
    const handleCaptionClick = (event) => {
      if (event.target.classList.contains('clickable-caption')) {
        const figureId = event.target.getAttribute('data-figure-id');
        const figureImgDiv = document.querySelector(`figure#${figureId} .hidden-image`);
        if (figureImgDiv) {
          figureImgDiv.style.display = figureImgDiv.style.display === 'none' ? 'block' : 'none';
        }
      }
    };

    document.addEventListener('click', handleCaptionClick);

    return () => {
      document.removeEventListener('click', handleCaptionClick);
    };
  }, []);

  return (
    <div className="wrapper">


      {/* Sidebar for Table of Contents */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="toggle-button" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? '>>' : '<<'}
        </button>
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


      {/* Render the FigurePanel component with the visible figures */}
      <FigurePanel figures={figures} visibleFigureIds={visibleFigureIds} />
      

      <Chatbot id={id}/>


    </div>
  );
}

export default Paper;
