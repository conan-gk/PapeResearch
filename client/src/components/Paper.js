// page that displays the content of a specific scientific paper, serves the html?

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';                       // used to extract the id parameter from the route 


function Paper() {
    const { id } = useParams();                                     // extracts id from the url used to identify which paper to fetch from the api
    const [paperContent, setPaperContent] = useState('');           // initialises a state variable paperContent as empty string, this state holds the html content of displayed paper

    useEffect(() => {
        fetch(`http://localhost:3001/api/papers/${id}`) // Send HTTP GET request to /api/papers/:id, retrieving the HTML content of the specified paper
            .then(res => res.text())                   // Parse response as plain text for HTML content
            .then(data => setPaperContent(data));      // Update paperContent state with fetched HTML content
    }, [id]);

    return (
        <div className="paper" dangerouslySetInnerHTML={{ __html: paperContent }} />    // Render 'paper' div, directly injecting HTML content into DOM
    );
}

export default Paper;