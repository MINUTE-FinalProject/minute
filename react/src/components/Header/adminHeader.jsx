import { Link } from "react-router-dom";
import logo from "../../assets/images/LO3.png";
import HeaderStyle from "./adminHeader.module.css";

function AdminHeader() {
  return (
    <div className={HeaderStyle.header}>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.icons}>
          <Link to="/">
            <img src={logo} alt="logo" className={HeaderStyle.logo} />
          </Link>
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

export default AdminHeader;
