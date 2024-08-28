import {Link} from "react-router-dom";
import { ReactComponent as Icon } from './assets/icons/book.svg'; // Import your SVG icon

export default function Header() {

  

  return (

    <header>
        <Link to="/" className="logo">  {/* Flex container for the logo */}
            <Icon className="book" />  {/* SVG icon as a React component */}
            <span className="homelogo">PapeResearch</span>  {/* Your site name */}
        </Link>      
        
        <nav>
            <>
              <Link to="/papers">Browse</Link>
            </>
        </nav>  
      </header>
    );
}