import React, { useState } from 'react';
import './search.css';

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
    <div className="container">
      <header>
        <div className="menu">≡</div>
        <div className="auth-buttons">
          <button>로그인</button>
          <button>로그아웃</button>
        </div>
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <input type="text" placeholder="검색..." />
            <button className="search-icon"><img src="/magnifying-glass.png" alt="돋보기" width="20" height="20"/></button>
          </div>
        </div>
      </header>
      <div className="grid">
        {currentItems.map((item) => (
          <div key={item.id} className="grid-item">
            <div className="item-content">
              <div className="placeholder"></div>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Search;