// components/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const menus = [
    "회원 관리",
    "신고회원 관리",
    "문의 관리",
    "공지사항 관리",
    "신고글 관리",
    "자유게시판",
  ];

  return (
    <aside className="sidebar">
      <ul>
        {menus.map((menu, index) => (
          <li key={index} className={menu === "신고회원 관리" ? "active" : ""}>
            {menu}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
