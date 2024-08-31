import {Link} from "react-router-dom";
import { ReactComponent as Icon } from './assets/icons/book.svg'; 

export default function Header() {

  return (

    <header>
        <Link to="/" className="logo">
            <Icon className="book" /> 
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