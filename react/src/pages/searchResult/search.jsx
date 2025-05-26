import { useState } from 'react';
import styles from "../../assets/styles/search.module.css";
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import SearchBar from '../../components/MainSearchBar/SearchBar';


function Search() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalItems = 100;

  const items = Array.from({ length: totalItems }, (_, index) => ({
    id: index + 1,
    title: `제목 ${index + 1}`
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.container}>
        <Header />
        <SearchBar showTitle={false} compact={true}  className={styles.searchCompact}/>
        {/* <header className={styles.header}>
          <div className={styles.searchBarWrapper}>
            <div className={styles.searchBar}>
              <input type="text" placeholder="검색..." />
              <button className={styles.searchIcon}>
                <img src="/src/assets/images/searchIcon.png" alt="" width="20" height="20" />
              </button>
            </div>
          </div>
        </header> */}
        <div className={styles.grid}>
          {currentItems.map((item) => (
            <div key={item.id} className={styles.gridItem}>
              <div className={styles.itemContent}>
                <div className={styles.placeholder}></div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? styles.active : ''}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Search;
