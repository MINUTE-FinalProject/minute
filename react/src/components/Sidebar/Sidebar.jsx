import { NavLink } from 'react-router-dom'; // NavLink import
import styles from './Sidebar.module.css';
// 예시 아이콘 (실제로는 react-icons 등에서 가져오거나 SVG 사용)
// import { FaUserFriends, FaBell, FaQuestionCircle, FaBullhorn, FaClipboardList, FaEdit } from 'react-icons/fa';

const Sidebar = () => {
    // 메뉴 데이터를 객체 배열로 변경하여 경로와 아이콘도 함께 관리
    const menus = [
        { name: "회원 관리", path: "/admin", icon: "👤" /* <FaUserFriends /> */ },
        { name: "신고회원 관리", path: "/reportedmembers", icon: "🔔" /* <FaBell /> */ },
        { name: "문의 관리", path: "/managerQna", icon: "❓" /* <FaQuestionCircle /> */ },
        { name: "공지사항 관리", path: "/managerNotice", icon: "📢" /* <FaBullhorn /> */ },
        { name: "신고글 관리", path: "/reportedposts", icon: "📝" /* <FaEdit /> */ },
        { name: "자유게시판", path: "/managerFreeboard", icon: "✍️" /* <FaEdit /> */ },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                {/* 로고가 있다면 여기에 추가 */}
                {/* <img src="/path/to/logo.png" alt="Admin Logo" className={styles.logo} /> */}
                <span className={styles.logoText}>MINUTE</span> {/* 예시 로고 텍스트 */}
            </div>
            <ul className={styles.menuList}>
                {menus.map((menu) => (
                    <li key={menu.name} className={styles.menuItem}>
                        <NavLink
                            to={menu.path}
                            // NavLink는 active일 때 자동으로 active 클래스를 부여하지만,
                            // CSS Modules에서는 styles.active를 직접 지정해야 할 수 있습니다.
                            // className={({ isActive }) => isActive ? `${styles.menuLink} ${styles.active}` : styles.menuLink}
                            // 또는 CSS에서 a.active 로 스타일링 가능
                            className={({ isActive }) => `${styles.menuLink} ${isActive ? styles.activeMenuItem : ''}`}
                        >
                            <span className={styles.menuIcon}>{menu.icon}</span>
                            <span className={styles.menuText}>{menu.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;