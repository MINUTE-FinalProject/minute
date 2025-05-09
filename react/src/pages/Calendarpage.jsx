import calendarpageStyle from "./Calendarpage.module.css";
import MypageNav from "./MypageNav";

function Calendarpage() {
    return (
        <>
            <MypageNav/>
            <div className={calendarpageStyle.contents_wrap}>
                <div className={calendarpageStyle.date}>4월 22일</div>
                <div className={calendarpageStyle.mainBox}>

                    <div className={calendarpageStyle.listSection}>
                        <div className={calendarpageStyle.listTitle}>
                            <h3>list</h3>
                        </div>
                        <div className={calendarpageStyle.listContent}>
                            <ul>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            <li><label><input type="checkbox" /> 충전기 챙기기!!!</label></li>
                            </ul>
                        </div>
                        <button className={calendarpageStyle.addButton}><img src="/src/images/+.png" /></button>
                    </div>

                    <div className={calendarpageStyle.planSection}>
                        <div className={calendarpageStyle.planTitle}>
                            <h3>plan</h3>
                        </div>
                        <div className={calendarpageStyle.planText}>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>

                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                            <p>부산 여행</p>
                            <p>1차 07:00 여행 시작</p>
                            <p>2차 11:00 비빔밥 집 도착</p>
                            <p>13:00 카페 도착</p>
                        </div>
                        <div className={calendarpageStyle.planIcons}>
                            <button className={calendarpageStyle.saveButton}><img src="/src/images/save.png" /></button>
                            <button className={calendarpageStyle.deleteButton}><img src="/src/images/delete.png" /></button>
                        </div>
                    </div>
                </div>

                <div className={calendarpageStyle.navArrows}>
                    <button className={calendarpageStyle.leftArrow}><img src="/src/images/left_arrow.png"/></button>
                    <button className={calendarpageStyle.rightArrow}><img src="/src/images/right_arrow.png"/></button>
                </div>
            </div>
        </>

    );

}

export default Calendarpage;