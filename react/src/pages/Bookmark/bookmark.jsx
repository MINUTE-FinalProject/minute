import React from 'react';
import bookmarkStyle from './bookmark.module.css';


const Bookmark = () => {
  return (
    <div className={bookmarkStyle.bookmarkContainer}>
      <aside className={bookmarkStyle.sidebar}>
        <div className={bookmarkStyle.logo}><img src="/logo.png" alt="로고" /></div>
        <div className={bookmarkStyle.menuIcon}>☰</div>
      </aside>
      <main className={bookmarkStyle.mainContent}>
        <header className={bookmarkStyle.header}>
          <h1>BOOKMARK</h1>
          <div className={bookmarkStyle.buttons}>
            <button className={bookmarkStyle.btn}>추가1</button>
            <button className={bookmarkStyle.btn}>삭제</button>
          </div>
        </header>
        <section className={bookmarkStyle.bookmarkGrid}>
          <div className={bookmarkStyle.bookmarkItem}>
            <div className={bookmarkStyle.bookmarkCard}>
              <div className={bookmarkStyle.placeholderImage}>
                <input type="checkbox" className={bookmarkStyle.bookmarkCheckbox} />
              </div>
            </div>
            <div className={bookmarkStyle.bookmarkFooter}>
              <div className={bookmarkStyle.bookmarkTitle}>힐링</div>
              <div className={bookmarkStyle.bookmarkOptions}>⋯</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Bookmark;