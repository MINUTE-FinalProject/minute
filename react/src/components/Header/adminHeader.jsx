import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/LO3.png";
import HeaderStyle from "./adminHeader.module.css"; // CSS 모듈 경로 확인

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. 실제 로그아웃 처리 로직 (매우 중요)
    // 예시: localStorage에서 토큰 삭제
    // localStorage.removeItem('authToken');
    // 예시: 전역 상태 업데이트 (Redux, Context API 등 사용 시)
    // dispatch({ type: 'LOGOUT' });

    console.log("로그아웃 처리 실행됨 (실제 로직 추가 필요)");

    // 2. 사용자 메인 페이지로 이동
    navigate("/");
  };

  // 키보드로도 로그아웃을 실행할 수 있도록 하는 핸들러
  const handleLogoutKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleLogout();
    }
  };

  return (
    <div className={HeaderStyle.header}>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.icons}>
          <Link to="/admin">
            <img src={logo} alt="logo" className={HeaderStyle.logo} />
          </Link>
        </div>
        <div className={HeaderStyle.auth}>
          <p className={HeaderStyle.welcomeMessage}>닉네임관리자님 환영합니다!</p>
          <p
            onClick={handleLogout}
            onKeyDown={handleLogoutKeyPress} // 키보드 이벤트 핸들러 추가
            className={HeaderStyle.logoutLink} // 스타일링을 위한 클래스
            role="button" // 의미론적으로 버튼임을 명시
            tabIndex={0}  // 키보드 포커스를 받을 수 있도록 설정
          >
            로그아웃
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;