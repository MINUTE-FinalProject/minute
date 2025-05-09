import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import HeaderStyle from './Header.module.css';

function Header() {
  return (
    <div className={HeaderStyle.header}>
        <div className={HeaderStyle.container}>
            <div className={HeaderStyle.icons}>
            <Link to="/"><img src="/src/images/LO3.png" alt="logo" className={HeaderStyle.logo} /></Link> 
            <HamburgerMenu />
            </div>
            <div className={HeaderStyle.auth}>
                <p>로그인</p>
                <p>회원가입</p>
                <Link to="/mypage"><p className={HeaderStyle.mypage}>마이페이지</p></Link>
            </div>
        </div>
    </div>
  );
}

export default Header;