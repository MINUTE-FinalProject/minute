import { useState } from "react";
import styles from "./HamburgerMenu.module.css";
import { Link } from "react-router-dom";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);

  return (
    <div className={styles.hamburgerContainer}>
      <div className={styles.hamburgerIcon} onClick={() => setIsOpen(!isOpen)}>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
      </div>

      <nav className={`${styles.menu} ${isOpen ? styles.show : ""}`}>
        <div className={styles.menuItem}>
          <a href="#" onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
            카테고리
          </a>
          {showCategoryMenu && (
            <div className={styles.submenu}>
              <Link to="/camping" onClick={() => setIsOpen(false)}>캠핑</Link>
              <Link to="/healing" onClick={() => setIsOpen(false)}>힐링</Link>
              <Link to="/mountain" onClick={() => setIsOpen(false)}>산</Link>
              <Link to="/themepark" onClick={() => setIsOpen(false)}>테마파크</Link>
            </div>
          )}
        </div>
        <div className={styles.menuItem}>
          <a href="#" onClick={() => setShowBoardMenu(!showBoardMenu)}>
            게시판
          </a>
          {showBoardMenu && (
            <div className={styles.submenu}>
              <Link to="">공지사항</Link>
              <Link to="">자유게시판</Link>
              <Link to="">Q&A게시판</Link>
            </div>
          )}
        </div>
        <div className={styles.menuItem}>
          <Link to="">월별추천</Link>
        </div>
      </nav>
    </div>
  );
}

export default HamburgerMenu;
