import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styles from "../../assets/styles/ManagerMyPage.module.css";

const ManagerMyPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  //사용자 정보 조회
  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },withCredentials: true
    })
    .then(res => {
      const data = res.data;

      
      if (data.code === "SU") { 
        setUserInfo({
          userName: data.userName,
          userNickName: data.userNickName,       
          userPhone: data.userPhone,
          profileImage: data.profileImage,
          userEmail: data.userEmail
        });
      } else {
        alert("사용자 정보를 불러오는데 실패했습니다.");
      }
    })
    .catch(() => alert("서버와 연결 실패"));
  }, [userId, token]);

  return (
    <>

      <div className={styles.container}>
        <div className={styles.main}>

          <main className={styles.mypage}>
            <h2>마이페이지</h2>
            <div className={styles.box}>
             <div className={styles.img}><img className={styles.img2} src={`http://localhost:8080${userInfo?.profileImage||"프로필이미지"}?t=${Date.now()}`}
                 alt="프로필" /></div>
              <div>
                <p>{userInfo?.userName || "이름"}관리자 님</p>
                <p>{userInfo?.userEmail || "이메일"}</p>
                <p>{userInfo?.userPhone || "전화번호"}</p>
                <button><Link to="/checkinfo">정보수정</Link></button>
              </div>
            </div>
            <div className={styles.stats}>
              <div>회원수<br /><strong>52명</strong></div>
              <div>문의수<br /><strong>19건</strong></div>
              <div>답변대기<br /><strong>3건</strong></div>
              <div>신고회원<br /><strong>5명</strong></div>
            </div>
            
          </main>
        </div>
      </div>
      
</>

  );
};

export default ManagerMyPage;
