
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./ManagerMyPage.css";

const ManagerMyPage = () => {
  return (
    <>
      <Header />
      <div className="container">
        <div className="main">
          <Sidebar />
          <main className="content">
            <h2>마이페이지</h2>
            <div className="box">
             <div className='img'><img className='img2' src='images/ex1.jpg'/></div>
              <div>
                <p>관리자 님</p>
                <p>admin01@gmail.com</p>
                <p>010-1234-4567</p>
                <button>정보수정</button>
              </div>
            </div>
            <div className="stats">
              <div>회원수<br /><strong>52명</strong></div>
              <div>문의수<br /><strong>19건</strong></div>
              <div>답변대기<br /><strong>3건</strong></div>
              <div>신고회원<br /><strong>5명</strong></div>
            </div>
            <footer>Minute 2025</footer>
          </main>
        </div>
      </div>
</>

  );
};

export default ManagerMyPage;
