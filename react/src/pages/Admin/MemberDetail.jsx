
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./MemberDetail.module.css";

const MemberDetail = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.memberDetail}>
          <h2>회원 관리 상세 - yujin0712</h2>
          <form>
            <div className={styles.formRow}>
              <label>name</label><input type="text" defaultValue="최유진" />
            </div>
            <div className={styles.formRow}>
              <label>nickname</label><input type="text" placeholder="닉네임" /><button>수정</button>
            </div>
            <div className={styles.formRow}>
              <label>gender</label>
              <div>
                <input type="radio" name="gender" /> Men
                <input type="radio" name="gender" checked readOnly /> <span className={styles.pink}>Female</span>
              </div>
            </div>
            <div className={styles.formRow}>
              <label>id</label><input type="text" defaultValue="yujin881023" /><button>수정</button>
            </div>
            <div className={styles.formRow}>
              <label>phone</label><input type="text" defaultValue="01012345678" /><button>수정</button>
            </div>
            <div className={styles.formRow}>
              <label>email</label><input type="text" defaultValue="yujin881023@naver.com" /><button>수정</button>
            </div>
            <div className={styles.formRow}>
              <label>birth</label><input type="text" defaultValue="20020712" /><button>수정</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default MemberDetail;
