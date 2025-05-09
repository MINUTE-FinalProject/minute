import styles from '../styles/Header.module.css';
import HamburgerMenu from './HamburgerMenu';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.icons}>
          <Link to="/">
            <img src="/images/logo.png" alt="logo" className={styles.logo} />
          </Link>
          <HamburgerMenu />
        </div>
        <div className={styles.auth}>
          <p>로그인</p>
          <p>회원가입</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
