import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/LO3.png";
import HamburgerMenu from "./HamburgerMenu";
import HeaderStyle from "./Header.module.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  //토큰으로 로그인 상태 관리
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 로고 클릭 시 메뉴바 닫기
  const handleLogoClick = () => {
    setIsOpen(false);
  };

  //로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // 로그아웃 후 홈으로 이동
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
          {isLoggedIn ? (
            <>
              <p onClick={handleLogout} className={HeaderStyle.logout}>
                로그아웃
              </p>
              <Link to="/mypage">
                <p className={HeaderStyle.mypage}>마이페이지</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <p className={HeaderStyle.login}>로그인</p>
              </Link>
              <Link to="/signupform">
                <p className={HeaderStyle.signup}>회원가입</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
