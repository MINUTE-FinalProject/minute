import HeaderStyle from './Header.module.css'
import HamburgerMenu from './HamburgerMenu';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className={HeaderStyle.header}>
        <div className={HeaderStyle.container}>
            <div className={HeaderStyle.icons}>
            <Link to="/"><img src="/src/images/logo.png" alt="logo" className={HeaderStyle.logo} /></Link> 
            <HamburgerMenu />
            </div>
            <div className={HeaderStyle.auth}>
                <p>로그인</p>
                <p>회원가입</p>
            </div>
        </div>
    </div>
  );
}

export default Header;