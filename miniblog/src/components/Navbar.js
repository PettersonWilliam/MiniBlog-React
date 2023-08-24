import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";

const Navbar = () => {
  return <nav className={styles.navbar} >
    <NavLink to='/'>
    Mini <span>Blog</span>
    </NavLink>
    <ul className={styles.links_list}>
        <li>
            <NavLink to='/'>Home</NavLink>
        </li>
        <li>
        <NavLink to='/about'>Sobre</NavLink>
        </li>
    </ul>
  </nav>
}

export default Navbar;
