import React from 'react';

function FigurePanel({ figures }) {
    return (
        <div className="figure-panel">
            {figures.length > 0 && figures.map((figure, index) => (
                <div key={index} className="figure-container">
                    <img 
                        src={figure.imgSrc} 
                        alt={figure.imgAlt}
                    />
                    <p>{figure.caption}</p>
                </div>
            ))}
        </div>
    );
}

export default FigurePanel;
