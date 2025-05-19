import { useEffect } from 'react';
import styles from './Modal.module.css'; // 사용자님이 지정하신 경로

function Modal({
  isOpen,
  onClose, // 모달을 닫는 함수 (필수)
  title,   // 모달 제목 (선택)
  message, // 모달 메시지 (문자열 또는 ReactNode)
  children, // message 대신 또는 추가로 복잡한 내용을 넣을 때 사용
  onConfirm, // 확인 버튼 클릭 시 실행될 함수
  confirmText = '확인', // 확인 버튼 텍스트
  cancelText, // 취소 버튼 텍스트 (이 값이 있으면 확인창, 없으면 알림창 스타일)
  onCancel,   // 취소 버튼 클릭 시 실행될 함수 (없으면 기본적으로 onClose 호출)
  type = 'default', // 모달 타입 ('error', 'success', 'warning' 등 스타일링에 활용 가능)
  hideCloseButton = false, // X 닫기 버튼 숨김 여부
}) {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation(); // 모달 컨텐츠 클릭 시 오버레이 클릭으로 인한 닫힘 방지
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    // onConfirm 실행 후 모달을 자동으로 닫을지는 onConfirm 함수 내부에서 결정하거나,
    // 여기서 onClose()를 호출하도록 할 수 있습니다. 사용 편의를 위해 일단 여기서 닫도록 합니다.
    // 필요시 이 부분을 onConfirm 함수의 책임으로 넘길 수 있습니다.
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose(); // onCancel이 없으면 기본적으로 onClose 실행
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={message || children ? 'modal-description' : undefined}
    >
      <div className={`${styles.modalContent} ${styles[type] || ''}`} onClick={handleContentClick}>
        {!hideCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            &times;
          </button>
        )}

        {title && <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>}

        {(message || children) && (
          <div id="modal-description" className={styles.modalBody}>
            {message && <p className={styles.modalMessage}>{message}</p>}
            {children}
          </div>
        )}

        <div className={styles.modalActions}>
          {cancelText && ( // cancelText가 제공될 때만 취소 버튼을 보여줌 (확인창 모드)
            <button
              type="button"
              className={`${styles.modalButton} ${styles.cancelButton}`}
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && ( // onConfirm 핸들러가 있을 때만 확인 버튼을 보여줌
             <button
                type="button"
                className={`${styles.modalButton} ${styles.confirmButton}`}
                onClick={handleConfirm}
             >
               {confirmText}
             </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;