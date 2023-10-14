import React from "react";
import styles from '../Styles/Search.module.scss'; 
import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import SearchContext from './searchContext';
export default function Search() {
  const { name } = useParams();
  const location = useLocation();

  const isGallery = location.pathname === '/mp2/gallery';
  const isDetail = !!name || isGallery;
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <SearchContext.Provider value={searchTerm}>
      <div className={styles.container}>
        <div className={styles.searchcontainer}>
          <img className={styles.img} src={`${process.env.PUBLIC_URL}/pokemon.jpeg`} alt="Pokemon" />
          <div className={styles.centerLinks}>
            <Link to={`list`} className={styles.link}>List</Link>
            <Link to={`gallery`} className={styles.link}>Gallery</Link>
          </div>
          {!isDetail && (
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        <Outlet />
      </div>
    </SearchContext.Provider>
  );
}
