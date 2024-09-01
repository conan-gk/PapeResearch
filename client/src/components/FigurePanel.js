import React, { useState } from 'react';
import pinIcon from '../assets/icons/push-pin_3419453.png';
import pinnedIcon from '../assets/icons/push-pin_3419424.png';

function FigurePanel({ figures, visibleFigureIds }) {
    const [pinnedFigures, setPinnedFigures] = useState([]); // State to keep track of pinned figures


    const togglePin = (figureId) => {
        setPinnedFigures(prevPinned => {
            if (prevPinned.includes(figureId)) {
                // If figure is already pinned, remove it from pinned list
                return prevPinned.filter(id => id !== figureId);
            } else {
                // If figure is not pinned, add to end of pinned list
                return [...prevPinned, figureId];
            }
        });
    };

    // Filter figures that are currently visible
    const visibleFigures = figures.filter(figure => visibleFigureIds.includes(figure.id));

    // Combine pinned figures and visible figures (excluding already pinned ones)
    const combinedFigures = [
        ...pinnedFigures.map(pinId => figures.find(figure => figure.id === pinId)),
        ...visibleFigures.filter(figure => !pinnedFigures.includes(figure.id))
    ];

    return (
        <div className="figure-panel">
            <div className="column_header">
                <b>FIGURES</b><br/>
            </div>

            {combinedFigures.length > 0 ? ( // If there are figures to display, render them
                combinedFigures.map(figure => (
                    <div key={figure.id} className="figure-container">

                        {/* Pin Icon */}
                        <div className="pin-icon" onClick={() => togglePin(figure.id)}>
                            <img 
                                src={pinnedFigures.includes(figure.id) ? pinnedIcon : pinIcon}  // Conditionally render based on pin state
                                alt="Pin Icon" 
                                style={{ width: '22px', height: '22px', transform: 'rotate(-45deg)' }}
                            />
                        </div>

                        {/* Figure rendered in panel */}
                        <img 
                            src={figure.imgSrc} 
                            alt={figure.imgAlt}
                        />
                        <p>{figure.caption}</p>
                    </div>
                ))
            ) : (
                // <p>No figures pinned or in view.</p> 
                <p></p>
            )}
        </div>
    );
}

export default FigurePanel;
