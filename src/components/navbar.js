import {Link} from "react-router-dom";
import './navbar.css'
import {useAuth} from "../auth/useAuth";

const Navbar = () => {
  const auth = useAuth();
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/">Todo</Link>
        </li>
        <li>
          <Link to="/backlog">Backlog</Link>
        </li>
        <li>
          <Link to="/login" onClick={() => {
            auth.logout();
          }}>Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;