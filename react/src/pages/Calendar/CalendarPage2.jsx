import React, { useState } from "react";
import { startOfWeek, addDays, format, differenceInMinutes } from "date-fns";

import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal";
import styles from "../../assets/styles/CalendarPage2.module.css";

export default function CalendarPage2() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const monthLabel = format(weekStart, "MMMM yyyy");
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Checklist
  const [items, setItems] = useState([{ id: 1, text: "충전기 챙기기" }]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState("");

  const addItem = () => {
    if (!newItemText.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), text: newItemText.trim() }]);
    setNewItemText("");
    setIsAddingItem(false);
  };
  const saveItem = () => {
    if (!editItemText.trim()) { setEditItemId(null); return; }
    setItems(prev => prev.map(it => it.id === editItemId ? { ...it, text: editItemText } : it));
    setEditItemId(null);
  };
  const removeItem = id => setItems(prev => prev.filter(it => it.id !== id));

  // Plans
  const [plans, setPlans] = useState([]);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: "", description: "", start: "00:00", end: "01:00" });
  const [editPlanId, setEditPlanId] = useState(null);

  const openAddPlan = (plan = null) => {
    if (plan) {
      setEditPlanId(plan.id);
      setNewPlan({ title: plan.title, description: plan.description, start: plan.start, end: plan.end });
    } else {
      setEditPlanId(null);
      setNewPlan({ title: "", description: "", start: "00:00", end: "01:00" });
    }
    setIsAddingPlan(true);
  };

  const addPlan = () => {
    if (!newPlan.title.trim()) { setIsAddingPlan(false); return; }
    if (editPlanId) {
      setPlans(prev => prev.map(p => p.id === editPlanId ? { ...p, ...newPlan } : p));
    } else {
      setPlans(prev => [...prev, { id: Date.now(), date: selectedDate, ...newPlan, color: '#FADADD' }]);
    }
    setEditPlanId(null);
    setIsAddingPlan(false);
  };
  const removePlan = id => setPlans(prev => prev.filter(p => p.id !== id));
  const todaysPlans = plans.filter(p => p.date === selectedDate);

  return (
    <>
      <MypageNav />
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.contents_wrap}>

            {/* Month Nav */}
            <div className={styles.monthNav}>
              <button className={styles.arrowBtn} onClick={() => setWeekStart(ws => addDays(ws, -7))}>&lt;</button>
              <span className={styles.monthLabel}>{monthLabel}</span>
              <button className={styles.arrowBtn} onClick={() => setWeekStart(ws => addDays(ws, 7))}>&gt;</button>
            </div>

            {/* Week Header */}
            <div className={styles.weekHeader}>
              {weekDays.map(d => {
                const ds = format(d, 'yyyy-MM-dd');
                const isSel = ds === selectedDate;
                return (
                  <div key={ds} className={[styles.dayBox, isSel && styles.selectedBox].filter(Boolean).join(' ')} onClick={() => setSelectedDate(ds)}>
                    <div className={styles.dateNum}>{format(d, 'd')}</div>
                    <div className={styles.weekDay}>{format(d, 'EEE').toUpperCase()}</div>
                  </div>
                );
              })}
            </div>

            {/* Main */}
            <div className={styles.mainBox}>

              {/* Checklist */}
              <div className={styles.listSection}>
                <div className={styles.panelHeader}>
                  <h3>Check-List</h3>
                  <button className={styles.addButton} onClick={() => { setIsAddingItem(true); setEditItemId(null); }}>＋</button>
                </div>
                {isAddingItem && (
                  <div className={styles.addForm}>
                    <input type='text' className={styles.addInput} placeholder='새 항목' value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyDown={e => e.key==='Enter' && addItem()} />
                    <button className={styles.confirmBtn} onClick={addItem}>✔</button>
                    <button className={styles.cancelBtn} onClick={() => setIsAddingItem(false)}>✕</button>
                  </div>
                )}
                <ul className={styles.listContent}>
                  {items.map(it => (
                    <li key={it.id} className={styles.listItem}>
                      {editItemId === it.id ? (
                        <>
                          <input type='text' className={styles.addInput} value={editItemText} onChange={e => setEditItemText(e.target.value)} onKeyDown={e => e.key==='Enter' && saveItem()} />
                          <button className={styles.confirmBtn} onClick={saveItem}>✔</button>
                          <button className={styles.cancelBtn} onClick={() => setEditItemId(null)}>✕</button>
                        </>
                      ) : (
                        <>
                          <label><input type='checkbox' /><span>{it.text}</span></label>
                          <div className={styles.listActions}>
                            <button className={styles.editItemBtn} onClick={() => { setEditItemId(it.id); setEditItemText(it.text); }}>✎</button>
                            <button className={styles.deleteItemBtn} onClick={() => removeItem(it.id)}><img src='/src/assets/images/delete.png' alt='삭제' className={styles.deleteBtn}/></button>
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
                  <h3>Plan</h3>
                  <button className={styles.addButton} onClick={() => openAddPlan()}>＋</button>
                </div>
                <div className={styles.scheduleGrid}>
                  <div className={styles.timeColumn}>
                    {Array.from({ length: 24 }, (_, i) => (i.toString().padStart(2, '0')+':00')).map(h => (
                      <div key={h} className={styles.timeCell}>{h}</div>
                    ))}
                  </div>
                  <div className={styles.cells} />
                  {todaysPlans.map(p => {
                    const [sh, sm] = p.start.split(':').map(Number);
                    const [eh, em] = p.end.split(':').map(Number);
                    const rowStart = Math.floor((sh*60 + sm)/60) + 1;
                    const duration = differenceInMinutes(new Date(0,0,0,eh,em), new Date(0,0,0,sh,sm));
                    const rowSpan = Math.ceil(duration/60);
                    return (
                      <div key={p.id} className={styles.planCard}
                           style={{ gridColumn:2, gridRow:`${rowStart} / span ${rowSpan}`, background:p.color }}
                           onClick={() => openAddPlan(p)}>
                        <h4 className={styles.planTitle}>{p.title}</h4>
                        {p.description && <p className={styles.planDesc}>{p.description}</p>}
                        <small className={styles.planTime}>{p.start} - {p.end}</small>
                        <button className={styles.deletePlanBtn} onClick={e => { e.stopPropagation(); removePlan(p.id); }}>🗑</button>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Plan */}
      <Modal isOpen={isAddingPlan}
             onClose={() => setIsAddingPlan(false)}
             title={editPlanId ? '일정 수정' : '새 일정 추가'}
             confirmText='저장'
             cancelText='취소'
             onConfirm={addPlan}
             onCancel={() => setIsAddingPlan(false)}>
        <div className={styles.modalContent}>
          <div className={styles.formColumn}>
            <label>제목</label>
            <input type='text'
                   value={newPlan.title}
                   onChange={e => setNewPlan(np => ({ ...np, title: e.target.value }))}
                   placeholder='일정 제목' />
          </div>
          <div className={styles.formColumn}>
            <label>시간</label>
            <div className={styles.timeRange}>
              <input type='time' min='00:00' max='23:59' step='60'
                     value={newPlan.start}
                     onChange={e => setNewPlan(np => ({ ...np, start: e.target.value }))} />
              <span className={styles.timeSeparator}>—</span>
              <input type='time' min='00:00' max='23:59' step='60'
                     value={newPlan.end}
                     onChange={e => setNewPlan(np => ({ ...np, end: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label>내용</label>
            <textarea rows={3} className={styles.planTextarea}
                      value={newPlan.description}
                      onChange={e => setNewPlan(np => ({ ...np, description: e.target.value }))}
                      placeholder='상세 내용을 입력하세요' />
          </div>
        </div>
      </Modal>
    </>
  );
}