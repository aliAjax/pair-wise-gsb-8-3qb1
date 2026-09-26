import React, { useState } from 'react';

const emptyRow = (holder) => ({ name: '', holder, qty: 1 });

export default function NewChapter({ campaign, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    date: '2024-07-01',
    summary: '',
    tag: '主线',
    places: '',
  });
  const [loot, setLoot] = useState([emptyRow(campaign.characters[0]?.name || '')]);

  const setRow = (i, patch) =>
    setLoot(loot.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const save = () => {
    if (!form.title) return;
    const chapter = {
      id: Date.now(),
      title: form.title,
      date: form.date,
      summary: form.summary,
      tag: form.tag,
      color: '#d8a153',
      places: form.places
        .split(/[,，、]/)
        .map((p) => p.trim())
        .filter(Boolean),
      loot: loot
        .filter((r) => r.name.trim() && Number(r.qty) > 0)
        .map((r, i) => ({
          id: `L${Date.now()}-${i}`,
          name: r.name.trim(),
          holder: r.holder,
          qty: Number(r.qty),
        })),
    };
    onSave(chapter);
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <span className="crumb">NEW CHAPTER</span>
        <h2>记录新的章节</h2>
        <label>
          章节标题
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="例：第三章：月下集市"
          />
        </label>
        <label>
          游戏日期
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label>
          章节摘要
          <textarea
            rows="3"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="发生了什么？"
          />
        </label>
        <label>
          本章地点（用逗号分隔）
          <input
            value={form.places}
            onChange={(e) => setForm({ ...form, places: e.target.value })}
            placeholder="例：灰港, 月下集市"
          />
        </label>
        <label>
          章节类型
          <select
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          >
            <option>主线</option>
            <option>支线</option>
            <option>番外</option>
          </select>
        </label>

        <div className="loot-editor">
          <small>本章战利品</small>
          {loot.map((r, i) => (
            <div className="loot-edit-row" key={i}>
              <input
                value={r.name}
                onChange={(e) => setRow(i, { name: e.target.value })}
                placeholder="物品名称"
              />
              <select
                value={r.holder}
                onChange={(e) => setRow(i, { holder: e.target.value })}
              >
                {campaign.characters.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={r.qty}
                onChange={(e) => setRow(i, { qty: e.target.value })}
              />
              <button
                className="row-del"
                onClick={() => setLoot(loot.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="row-add"
            onClick={() =>
              setLoot([...loot, emptyRow(campaign.characters[0]?.name || '')])
            }
          >
            ＋ 添加一件物品
          </button>
        </div>

        <button className="primary full" onClick={save}>保存章节</button>
      </div>
    </div>
  );
}
