import styles from "../../assets/styles/CheckDelete.module.css";

function CheckDelete() {
    return (
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.box}>
                <h1 className={styles["main-text"]}>정말 탈퇴하시겠습니까?</h1>

                <div className={styles.box1}>
                    <span className={styles.redtext}>
                        회원탈퇴 시 개인정보 및 MIN:UTE 에서 만들어진 모든 데이터는 삭제됩니다.
                        (단, 아래 항목은 표기된 법률에 따라 특정 기간 동안 보관됩니다.)
                    </span>
                    <h4>
                        1. 이용자 식별 정보: 개인정보 보호법에 의거하여, 탈퇴 후 최대 1년간 보관될 수 있습니다.<br />
                        2. 서비스 이용 기록: 통신비밀보호법에 따라 최대 3년간 보관될 수 있습니다.<br />
                        3. 민원 및 분쟁 처리 기록: 민원처리 및 법적 분쟁을 대비하여 최대 3년간 보관될 수 있습니다.<br />
                        4. 상담 및 고객 지원 기록: 고객지원 및 서비스 개선을 위한 기록은 최대 1년간 보관될 수 있습니다.<br />
                        5. 부정 이용 방지 기록: 부정 이용 방지 및 안전한 서비스 제공을 위해 관련 정보는 최대 1년간 보관될 수 있습니다.
                    </h4>
                </div>

                <h1 className={styles["body-text"]}>▪ 유의사항</h1>
                <div className={styles.box2}>
                    <h4>
                        ▪ 회원 탈퇴를 진행하시면 더 이상 MIN:UTE의 서비스를 이용하실 수 없습니다.<br />
                        ▪ 회원 탈퇴를 진행하시면 저장된 북마크 데이터는 모두 삭제되고 복구하실 수 없습니다.
                    </h4>
                </div>

                <h1 className={styles["body-text"]}>▪ 탈퇴사유</h1>
                <input
                    type="text"
                    id="birth"
                    className={styles.text_box}
                    placeholder="예시) 아이디 변경/ 재가입 목적"
                />

                <div>
                    <input type="checkbox" id="agree" />
                    <label htmlFor="agree">해당 내용을 모두 확인했으며, 회원탈퇴에 동의합니다.</label>
                </div>

               
                <button className={styles.da_btn}>회원 탈퇴</button>
            </div>
        </div>
        </div>
    );
}

export default CheckDelete;
