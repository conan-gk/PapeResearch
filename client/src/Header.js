import { useContext, useEffect } from "react";
import {Link} from "react-router-dom";
// import { UserContext } from "./UserContext";

export default function Header() {

  

  return (
    <header>
        <Link to="/" className="logo">PapeResearch</Link>      {/* Home button */}
        <nav>

            <>
              <Link to="/papers">Browse Papers</Link>
            </>
          
        </nav>        
      </header>
    );
}