// page that displays a list of all scientific papers.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PapersList() {
    const [papers, setPapers] = useState([]);           
    // initialises a state variable 'papers' with an empty list that will store the list of papers fetched from the API.



    useEffect(() => {
        fetch('http://localhost:3001/api/papers')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched papers:", data);
                setPapers(data);
            });
    }, []);
    

    return (
        <div className="papers-list">
            <h1>Explore all available papers</h1>                                  
            <ul>
                {papers.map(paper => (
                    <li key={paper._id}>                                          {/* Each list item uses the paper's _id as a unique key */}
                        <Link to={`/paper/${paper._id}`}>{paper.title}</Link>     {/* Clickable link for each paper */}
                    </li>  
                ))}
            </ul>
        </div>
    );
}

export default PapersList;