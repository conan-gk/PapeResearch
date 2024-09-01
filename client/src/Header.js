import {Link} from "react-router-dom";
import { ReactComponent as Icon } from './assets/icons/book.svg'; 
import researchIcon from './assets/icons/computer.png';

export default function Header() {

  return (

    <header>
        <Link to="/" className="logo">
          {/* Replace the SVG component with an img tag */}
          <img src={researchIcon} alt="Research Icon" className="header-icon" />
          <span className="homelogo">PapeResearch</span>
        </Link>    
        
        <nav>
            <>
              <Link to="/papers">Browse</Link>
            </>
        </nav>  
      </header>
    );
}