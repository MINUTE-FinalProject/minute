import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../assets/styles/MemberDetail.module.css";

const mockMembers = [
  {
    id: "yujin0712",
    name: "최유진",
    nickname: "유진",
    gender: "female",
    loginId: "yujin881023",
    phone: "01012345678",
    email: "yujin881023@naver.com",
    birth: "20020712"
  },
  {
    id: "hodu1030",
    name: "김호두",
    nickname: "호두",
    gender: "male",
    loginId: "hodu1030",
    phone: "01098765432",
    email: "hodu@example.com",
    birth: "19990310"
  }
];

const MemberDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const found = mockMembers.find((m) => m.id === id);
    setMember(found);
  }, [id]);

  if (!member) {
    return <div className={styles.container}>존재하지 않는 회원입니다.</div>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.memberDetail}>
        <h2>회원 관리 상세 - {member.id}</h2>
        <form>
          <div className={styles.formRow}>
            <label>name</label>
            <input type="text" defaultValue={member.name} />
          </div>
          <div className={styles.formRow}>
            <label>nickname</label>
            <input type="text" defaultValue={member.nickname} />
            <button type="button">수정</button>
          </div>
          <div className={styles.formRow}>
            <label>gender</label>
            <div>
              <input
                type="radio"
                name="gender"
                checked={member.gender === "male"}
                readOnly
              />{" "}
              Men
              <input
                type="radio"
                name="gender"
                checked={member.gender === "female"}
                readOnly
              />{" "}
              <span className={styles.pink}>Female</span>
            </div>
          </div>
          <div className={styles.formRow}>
            <label>id</label>
            <input type="text" defaultValue={member.loginId} />
            <button type="button">수정</button>
          </div>
          <div className={styles.formRow}>
            <label>phone</label>
            <input type="text" defaultValue={member.phone} />
            <button type="button">수정</button>
          </div>
          <div className={styles.formRow}>
            <label>email</label>
            <input type="text" defaultValue={member.email} />
            <button type="button">수정</button>
          </div>
          <div className={styles.formRow}>
            <label>birth</label>
            <input type="text" defaultValue={member.birth} />
            <button type="button">수정</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MemberDetail;
