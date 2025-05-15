import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MypageNav.module.css";

function MypageNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showBoardMenu, setShowBoardMenu] = useState(false);

    return (
        <div className={styles.divStyle}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src="/src/assets/images/LO2.png"/>
                </Link>
            </div>
            <div className={styles.hamburgerContainer}>
            <div
                className={styles.hamburgerIcon}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
                <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
                <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
            </div>

                <nav className={`${styles.menu} ${isOpen ? styles.show : ""}`}>
                    <div className={styles.menuItem}>
                    <a href="#" onClick={() => setShowCategoryMenu(prev => !prev)}>
                        카테고리
                    </a>
                    {showCategoryMenu && (
                        <div className={styles.submenu}>
                        <Link to="/camping" onClick={() => setIsOpen(false)}>
                            캠핑
                        </Link>
                        <Link to="/healing" onClick={() => setIsOpen(false)}>
                            힐링
                        </Link>
                        <Link to="/mountain" onClick={() => setIsOpen(false)}>
                            산
                        </Link>
                        <Link to="/themepark" onClick={() => setIsOpen(false)}>
                            테마파크
                        </Link>
                        </div>
                    )}
                    </div>

                    <div className={styles.menuItem}>
                    <a href="#" onClick={() => setShowBoardMenu(prev => !prev)}>
                        게시판
                    </a>
                    {showBoardMenu && (
                        <div className={styles.submenu}>
                        <Link to="/notice" onClick={() => setIsOpen(false)}>
                            공지사항
                        </Link>
                        <Link to="/freeboard" onClick={() => setIsOpen(false)}>
                            자유게시판
                        </Link>
                        <Link to="/qna" onClick={() => setIsOpen(false)}>
                            Q&A게시판
                        </Link>
                        </div>
                    )}
                    </div>

                    <div className={styles.menuItem}>
                    <Link to="" onClick={() => setIsOpen(false)}>
                        월별추천
                    </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default MypageNav;