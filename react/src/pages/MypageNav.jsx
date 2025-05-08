import { useState } from "react";
import mypagenavStyle from "./MypageNav.module.css";

function MypageNav() {
    const [ showSidebar, setShowSidebar] = useState(false);
    const [showCategorySub, setShowCategorySub] = useState(false);
    const [showBoardSub, setShowBoardSub] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(prev => !prev);
    };
    const toggleCategory = () => {
        setShowCategorySub(prev => !prev);
    };
    const toggleBoard = () => {
        setShowBoardSub(prev => !prev);
    };

    return (
        <div className={mypagenavStyle.contents_wrap}>
            <div className={mypagenavStyle.divStyle}>
                <div className={mypagenavStyle.logo}>
                    <img src="/src/imgs/logo.png"/>
                </div>
                <div className={mypagenavStyle.menu} onClick={toggleSidebar}>
                    <img src="/src/imgs/Menu.png"/>
                </div>

            </div> 
                {showSidebar && (
                    <div className={mypagenavStyle.sideBar}>
                        <h3 onClick={toggleCategory}>카테고리</h3>
                        {showCategorySub && (
                            <ul className={mypagenavStyle.subMenu}>
                                <li>
                                    테마파크
                                </li>
                                <li>
                                    캠핑
                                </li>
                                <li>
                                    산
                                </li>
                                <li>
                                    힐링
                                </li>
                            </ul>
                        )}
                        <hr></hr>

                        <h3 onClick={toggleBoard}>게시판</h3>
                        {showBoardSub && (
                            <ul className={mypagenavStyle.subMenu}>
                                <li>
                                    공지사항
                                </li>
                                <li>
                                    Q&A
                                </li>
                                <li>
                                    자유게시판
                                </li>
                            </ul>
                        )}
                        <hr></hr>

                        <h3>월별 추천</h3>
                        <hr></hr>
                    </div>
                )}
        </div>
    );
}

export default MypageNav;