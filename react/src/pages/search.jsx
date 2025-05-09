import React, { useState } from 'react';
import searchStyle from './search.module.css';

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
    <div className={searchStyle.container}>
      <header className={searchStyle.header}>
        <div className={searchStyle.menu}>≡</div>
        <div className={searchStyle.authButtons}>
          <button>로그인</button>
          <button>회원가입</button>
        </div>
        <div className={searchStyle.searchBarWrapper}>
          <div className={searchStyle.searchBar}>
            <input type="text" placeholder="검색..." />
            <button className={searchStyle.searchIcon}>
              <img src="/src/images/searchIcon.png" alt="" width="20" height="20" />
            </button>
          </div>
        </div>
      </header>
      <div className={searchStyle.grid}>
        {currentItems.map((item) => (
          <div key={item.id} className={searchStyle.gridItem}>
            <div className={searchStyle.itemContent}>
              <div className={searchStyle.placeholder}></div>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={searchStyle.pagination}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? searchStyle.active : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Search;