import React from 'react';
import './bookmark.css';

const Bookmark = () => {
  return (
    <div className="bookmark-container">
      <aside className="sidebar">
        <div className="logo"><img src="/logo.png" alt="로고" /></div>
        <div className="menu-icon">☰</div>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>BOOKMARK</h1>
          <div className="buttons">
            <button className="btn">추가</button>
            <button className="btn">삭제</button>
          </div>
        </header>
        <section className="bookmark-grid">
          <div className="bookmark-item">
            <div className="bookmark-card">
              <div className="placeholder-image"></div> {/* Placeholder로 이미지 대신 */}
              <input type="checkbox" />
            </div>
            <div className="bookmark-footer">
              <div className="bookmark-title">힐링</div>
              <div className="bookmark-options">⋯</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Bookmark;