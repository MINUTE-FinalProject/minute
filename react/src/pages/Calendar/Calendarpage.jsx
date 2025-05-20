import MypageNav from "../../components/MypageNavBar/MypageNav";
import calendarpageStyle from "./Calendarpage.module.css";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import { useState } from "react";

function Calendarpage() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
      title: '',
      message: '',
      onConfirm: null,
      confirmText: '확인',
      cancelText: null,
      type: 'default',
      confirmButtonType: 'primary',
      cancelButtonType: 'secondary'
  });
  return (
    <>
    <MypageNav />
      <div className={calendarpageStyle.layout}>
        <div className={calendarpageStyle.container}>
          <div className={calendarpageStyle.contents_wrap}>
        <div className={calendarpageStyle.date}>4월 22일</div>
        <div className={calendarpageStyle.mainBox}>
          <div className={calendarpageStyle.listSection}>
            <div className={calendarpageStyle.listTitle}>
              <h3>Check-List</h3>
            </div>
            <div className={calendarpageStyle.listContent}>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> 충전기 챙기기!!!
                  </label>
                </li>
              </ul>
            </div>
            <button className={calendarpageStyle.addButton}>
              <img src="/src/assets/images/+.png" />
            </button>
          </div>

          <div className={calendarpageStyle.planSection}>
            <div className={calendarpageStyle.planTitle}>
              <h3>Plan</h3>
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
              <button className={calendarpageStyle.saveButton}
              onClick={() => {
                  setModalProps({
                    title: '저장 완료',
                    message: 'Check-list, Plan이 저장되었습니다.',
                    confirmText: '확인',
                    type: 'success',
                    confirmButtonType: 'primary',
                    onConfirm: () => setIsModalOpen(false) // 확인 버튼 누르면 모달 닫기
                  });
                  setIsModalOpen(true);
                }}
              >
                <img src="/src/assets/images/save.png" />
              </button>
              <button className={calendarpageStyle.deleteButton}
                onClick={() => {
                  setModalProps({
                    title: '삭제 확인',
                    message: 'Check-list, Plan을 정말 삭제하시겠습니까?',
                    confirmText: '삭제',
                    cancelText: '취소',
                    type: 'warning',
                    confirmButtonType: 'danger',
                    onConfirm: () => {
                      console.log("삭제되었습니다.");
                      setIsModalOpen(false);
                    },
                    onCancel: () => {
                      console.log("삭제 취소됨");
                      setIsModalOpen(false);
                    }
                  });
                  setIsModalOpen(true);
                }}
              >
                <img src="/src/assets/images/delete.png" />
              </button>
            </div>
          </div>
        </div>

        <div className={calendarpageStyle.navArrows}>
          <button className={calendarpageStyle.leftArrow}>
            <img src="/src/assets/images/left_arrow.png" />
          </button>
          <button className={calendarpageStyle.rightArrow}>
            <img src="/src/assets/images/right_arrow.png" />
          </button>
        </div>
      </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalProps.title}
        message={modalProps.message}
        onConfirm={modalProps.onConfirm}
        confirmText={modalProps.confirmText}
        cancelText={modalProps.cancelText}
        onCancel={modalProps.onCancel}
        type={modalProps.type}
        confirmButtonType={modalProps.confirmButtonType}
        cancelButtonType={modalProps.cancelButtonType}
      />
    </>
  );
}

export default Calendarpage;
