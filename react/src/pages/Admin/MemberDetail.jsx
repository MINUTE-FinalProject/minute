
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./MemberDetail.css";

const MemberDetail = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="member-detail">
          <h2>회원 관리 상세 - yujin0712</h2>
          <form>
            <div className="form-row">
            <label>name</label><input type="text" defaultValue="최유진" />
            </div>
            <div className="form-row">
            <label>nickname</label><input type="text" placeholder="닉네임" /><button>수정</button>
            </div>
            <div className="form-row">
            <label>gender</label>
              <div>
                <input type="radio" name="gender" /> Men
                <input type="radio" name="gender" checked readOnly /> <span className="pink">Female</span>
              </div>
            </div>
            <div className="form-row">
            <label>id</label><input type="text" defaultValue="yujin881023" /><button>수정</button>
            </div>
            <div className="form-row">
            <label>phone</label><input type="text" defaultValue="01012345678" /><button>수정</button>
            </div>
            <div className="form-row">
            <label>email</label><input type="text" defaultValue="yujin881023@naver.com" /><button>수정</button>
            </div>
            <div className="form-row">
            <label>birth</label><input type="text" defaultValue="20020712" /><button>수정</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default MemberDetail;
