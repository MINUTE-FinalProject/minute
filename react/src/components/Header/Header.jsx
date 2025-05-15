import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/LO3.png";
import HamburgerMenu from "./HamburgerMenu";
import HeaderStyle from "./Header.module.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // 로고 클릭 시 메뉴바 닫기
  const handleLogoClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={HeaderStyle.header}>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.icons}>
          <Link to="/" onClick={handleLogoClick}>
            <img src={logo} alt="logo" className={HeaderStyle.logo} />
          </Link>
          <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className={HeaderStyle.auth}>
          <Link to="/login">
            <p className={HeaderStyle.login}>로그인</p>
          </Link>
          <Link to="/signupform">
            <p className={HeaderStyle.signup}>회원가입</p>
          </Link>
          <Link to="/mypage">
            <p className={HeaderStyle.mypage}>마이페이지</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
