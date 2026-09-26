import React, { useState } from 'react';

const emptyRow = () => ({ item: '', holder: '', qty: 1 });

export default function NewChapter({ characters, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', date: '2024-07-06', summary: '', tag: '主线', places: '' });
  const [rows, setRows] = useState([]);
  const setRow = (i, patch) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const save = () => {
    if (!form.title.trim()) return;
    const places = form.places.split(/[,，、;；\n]/).map((s) => s.trim()).filter(Boolean);
    const loot = rows
      .map((r) => ({ item: r.item.trim(), holder: r.holder, qty: Math.max(1, parseInt(r.qty, 10) || 0) }))
      .filter((r) => r.item && r.holder);
    onSave({
      id: Date.now(),
      title: form.title.trim(),
      date: form.date,
      summary: form.summary.trim(),
      tag: form.tag,
      places,
      loot,
    });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <span className="crumb">NEW CHAPTER</span>
        <h2>记录新的章节</h2>
        <label>章节标题<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：第四章：雾港废墟" /></label>
        <label>游戏日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
        <label>章节摘要<textarea rows="2" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="发生了什么？" /></label>
        <label>章节类型<select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}><option>主线</option><option>支线</option><option>番外</option></select></label>
        <label>途经地点（顿号或逗号分隔）<input value={form.places} onChange={(e) => setForm({ ...form, places: e.target.value })} placeholder="例：灰港、月下集市" /></label>
        <div className="loot-edit">
          <div className="loot-edit-head">
            <span>战利品登记（物品 · 持有人 · 数量）</span>
            <button type="button" className="mini" onClick={() => setRows([...rows, emptyRow()])}>＋ 添加物品</button>
          </div>
          {rows.length === 0 && <p className="none">本章没有战利品可留空</p>}
          {rows.map((r, i) => (
            <div className="loot-row" key={i}>
              <input value={r.item} onChange={(e) => setRow(i, { item: e.target.value })} placeholder="物品名称" />
              <select value={r.holder} onChange={(e) => setRow(i, { holder: e.target.value })}>
                <option value="">持有人</option>
                {characters.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <input type="number" min="1" value={r.qty} onChange={(e) => setRow(i, { qty: e.target.value })} />
              <button type="button" className="mini danger" onClick={() => setRows(rows.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
        </div>
        <button className="primary full" onClick={save}>保存章节</button>
      </div>
    </div>
  );
}
