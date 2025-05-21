import React, { useRef, useState, useEffect } from "react";
import { startOfWeek, addDays, format, differenceInMinutes } from "date-fns";

import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal";
import styles from "../../assets/styles/CalendarPage2.module.css";
import WeatherWidget from "./WeatherWidget";
import FiveDayForecast from "./FiveDayForecast";

export default function CalendarPage2() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const [weekStart, setWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const monthLabel = format(new Date(selectedDate), "MMMM yyyy");
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(weekStart, i)
  );

  // === Checklist 상태 === //
  const [items, setItems] = useState([{ id: 1, text: "충전기 챙기기" }]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState("");
  const listRef = useRef(null);

  // 외부 클릭 시 edit/add 모드 취소 로직
  const onListSectionClick = (e) => {
    // 1) 편집 모드 취소
    if (editItemId !== null) {
      // 체크박스나 버튼 클릭 시 무시
      if (
        (e.target.tagName === "INPUT" && e.target.type === "checkbox") ||
        e.target.closest("button")
      )
        return;
      // 현재 편집 중인 li 내부 클릭 시 무시
      const editingLi = listRef.current.querySelector(
        `[data-id="${editItemId}"]`
      );
      if (editingLi && editingLi.contains(e.target)) return;
      // 그 외 외부 클릭은 편집 취소
      setEditItemId(null);
      return;
    }

    // 2) 추가 모드 취소
    if (isAddingItem) {
      const addForm = listRef.current.querySelector(`.${styles.addForm}`);
      // addForm 내부가 아닐 때만 취소
      if (addForm && !addForm.contains(e.target)) {
        setIsAddingItem(false);
        setNewItemText("");
      }
      return;
    }
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now(), text: newItemText.trim() },
    ]);
    setNewItemText("");
    setIsAddingItem(false);
  };
  const saveItem = () => {
    if (!editItemText.trim()) {
      setEditItemId(null);
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.id === editItemId ? { ...it, text: editItemText } : it
      )
    );
    setEditItemId(null);
  };
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  // === Plan 상태 === //
  const [plans, setPlans] = useState([]);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    start: "00:00",
    end: "01:00",
  });
  const [editPlanId, setEditPlanId] = useState(null);

  const openAddPlan = (plan = null) => {
    if (plan) {
      setEditPlanId(plan.id);
      setNewPlan({
        title: plan.title,
        description: plan.description,
        start: plan.start,
        end: plan.end,
      });
    } else {
      setEditPlanId(null);
      setNewPlan({ title: "", description: "", start: "00:00", end: "01:00" });
    }
    setIsAddingPlan(true);
  };

  const addPlan = () => {
    if (!newPlan.title.trim()) {
      setIsAddingPlan(false);
      return;
    }
    if (editPlanId) {
      setPlans((prev) =>
        prev.map((p) => (p.id === editPlanId ? { ...p, ...newPlan } : p))
      );
    } else {
      setPlans((prev) => [
        ...prev,
        { id: Date.now(), date: selectedDate, ...newPlan, color: "#FADADD" },
      ]);
    }
    setEditPlanId(null);
    setIsAddingPlan(false);
  };
  const removePlan = (id) =>
    setPlans((prev) => prev.filter((p) => p.id !== id));
  const todaysPlans = plans.filter((p) => p.date === selectedDate);

  return (
    <>
      <MypageNav />
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.contents_wrap}>
            {/* Month Nav */}
            <div className={styles.monthNav}>
              <span className={styles.monthLabel}>{monthLabel}</span>
            </div>

            {/* Week Header */}
            <div className={styles.weekHeader}>
              <button
                className={styles.arrowBtn}
                onClick={() =>
                  setWeekStart((ws) => addDays(ws, -7))
                }
              >
                &lt;
              </button>
              {weekDays.map((d) => {
                const ds = format(d, "yyyy-MM-dd");
                const isSel = ds === selectedDate;
                return (
                  <div
                    key={ds}
                    className={[
                      styles.dayBox,
                      isSel && styles.selectedBox,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedDate(ds)}
                  >
                    <div className={styles.dateNum}>
                      {format(d, "d")}
                    </div>
                    <div className={styles.weekDay}>
                      {format(d, "EEE").toUpperCase()}
                    </div>
                  </div>
                );
              })}
              <button
                className={styles.arrowBtn}
                onClick={() =>
                  setWeekStart((ws) => addDays(ws, 7))
                }
              >
                &gt;
              </button>
            </div>

            {/* Main Content */}
            <div className={styles.mainBox}>
              {/* Checklist Section */}
              <div
                className={styles.listSection}
                ref={listRef}
                onClick={onListSectionClick}
              >
                <div className={styles.panelHeader}>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setIsAddingItem(true);
                      setEditItemId(null);
                    }}
                  >
                    <img
                      src="/src/assets/images/plus.png"
                      alt="추가"
                    />
                  </button>
                </div>

                {/* Add Form */}
                {isAddingItem && (
                  <div className={styles.addForm}>
                    <input
                      type="text"
                      className={styles.addInput}
                      placeholder="새 항목"
                      value={newItemText}
                      onChange={(e) =>
                        setNewItemText(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && addItem()
                      }
                    />
                    <button
                      onClick={addItem}
                      className={styles.confirmBtn}
                    >
                      ✔
                    </button>
                  </div>
                )}

                {/* Item List */}
                <ul className={styles.listContent}>
                  {items.map((it) => (
                    <li
                      key={it.id}
                      data-id={it.id}
                      className={styles.listItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 체크박스나 버튼이면 편집 진입 막기
                        if (
                          e.target.tagName === "INPUT" ||
                          e.target.closest("button")
                        )
                          return;
                        setEditItemId(it.id);
                        setEditItemText(it.text);
                        setIsAddingItem(false);
                      }}
                    >
                      {editItemId === it.id ? (
                        <>
                          <input
                            type="text"
                            className={styles.addInput}
                            value={editItemText}
                            onChange={(e) =>
                              setEditItemText(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveItem()
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveItem();
                            }}
                            className={styles.confirmBtn}
                          >
                            ✔
                          </button>
                        </>
                      ) : (
                        <>
                          <label>
                            <input type="checkbox" />
                            <span>{it.text}</span>
                          </label>
                          <div className={styles.listActions}>
                            <button
                              className={styles.deleteItemBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(it.id);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan Section */}
              <section className={styles.planSection}>
                <div className={styles.panelHeader}>
                  <button
                    className={styles.addButton}
                    onClick={() => openAddPlan()}
                  >
                    <img
                      src="/src/assets/images/plus.png"
                      alt="일정 추가"
                    />
                  </button>
                </div>
                <div className={styles.scheduleGrid}>
                  <div className={styles.timeColumn}>
                    {Array.from({ length: 24 }, (_, i) =>
                      (i.toString().padStart(2, "0") + ":00")
                    ).map((h) => (
                      <div key={h} className={styles.timeCell}>
                        {h}
                      </div>
                    ))}
                  </div>
                  <div className={styles.cells} />
                  {todaysPlans.map((p) => {
                    const [sh, sm] = p.start.split(":").map(Number);
                    const [eh, em] = p.end.split(":").map(Number);
                    // 분단위 그대로 계산
                    const startTotal = sh * 60 + sm;              // ex. 1:30 → 90
                    const duration   = eh * 60 + em - startTotal;  // ex. 2:15 - 1:30 = 45분
                    const rowStart = startTotal + 1;              // grid-row는 1부터
                    const rowSpan  = duration;
                    return (
                      <div
                        key={p.id}
                        className={styles.planCard}
                        style={{
                          gridColumn: 2,
                          gridRow: `${rowStart} / span ${rowSpan}`,
                          background: p.color,
                        }}
                        onClick={() => openAddPlan(p)}
                      >
                        <h4 className={styles.planTitle}>
                          {p.title}
                        </h4>
                        {p.description && (
                          <p className={styles.planDesc}>
                            {p.description}
                          </p>
                        )}
                        <small className={styles.planTime}>
                          {p.start} - {p.end}
                        </small>
                        <button
                          className={styles.deletePlanBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlan(p.id);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Weather & Character */}
              <div className={styles.weatherSection}>
                <WeatherWidget />
                <FiveDayForecast />
                <div className={styles.character}>
                  <img
                    src="src/assets/images/character.png"
                    alt="walking character"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Add/Edit Modal */}
      <Modal
        isOpen={isAddingPlan}
        onClose={() => setIsAddingPlan(false)}
        title={editPlanId ? "일정 수정" : "새 일정 추가"}
        confirmText="저장"
        cancelText="취소"
        onConfirm={addPlan}
        onCancel={() => setIsAddingPlan(false)}
      >
        <div className={styles.modalContent}>
          <div className={styles.formColumn}>
            <label>제목</label>
            <input
              type="text"
              value={newPlan.title}
              onChange={(e) =>
                setNewPlan((np) => ({
                  ...np,
                  title: e.target.value,
                }))
              }
              placeholder="일정 제목"
            />
          </div>
          <div className={styles.formColumn}>
            <label>시간</label>
            <div className={styles.timeRange}>
              <input
                type="time"
                min="00:00"
                max="23:59"
                step="60"
                value={newPlan.start}
                onChange={(e) =>
                  setNewPlan((np) => ({
                    ...np,
                    start: e.target.value,
                  }))
                }
              />
              <span className={styles.timeSeparator}>—</span>
              <input
                type="time"
                min="00:00"
                max="23:59"
                step="60"
                value={newPlan.end}
                onChange={(e) =>
                  setNewPlan((np) => ({
                    ...np,
                    end: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label>내용</label>
            <textarea
              rows={3}
              className={styles.planTextarea}
              value={newPlan.description}
              onChange={(e) =>
                setNewPlan((np) => ({
                  ...np,
                  description: e.target.value,
                }))
              }
              placeholder="상세 내용을 입력하세요"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
