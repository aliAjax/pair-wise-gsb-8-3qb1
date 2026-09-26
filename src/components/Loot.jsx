import React, { useMemo, useState } from 'react';
import {
  orderedSessions,
  lootStats,
  itemNames,
  itemHistory,
  transferLoot,
} from '../lib/ledger.js';

export default function Loot({ campaign, onChange, notify }) {
  const sessions = useMemo(() => orderedSessions(campaign), [campaign]);
  const stats = useMemo(() => lootStats(campaign), [campaign]);
  const names = useMemo(() => itemNames(campaign), [campaign]);

  const [form, setForm] = useState({ name: '', fromHolder: '', toHolder: '', qty: 1 });
  const [sessionId, setSessionId] = useState(sessions[0]?.id);
  const [error, setError] = useState('');

  // 所选物品当前仍有结余的持有人，作为“转出方”的可选项
  const holders = stats.filter((r) => r.name === form.name && r.qty > 0);

  const pickName = (name) => {
    setForm({ name, fromHolder: '', toHolder: '', qty: 1 });
    setError('');
  };

  const submit = () => {
    const result = transferLoot(campaign, {
      name: form.name,
      fromHolder: form.fromHolder,
      toHolder: form.toHolder,
      qty: form.qty,
      toSessionId: sessionId,
    });
    if (result.ok) {
      onChange(result.campaign);
      setError('');
      setForm({ ...form, qty: 1 });
      notify(`「${form.name}」× ${form.qty} 已转手给 ${form.toHolder}`);
    } else if (result.reason === 'shortage') {
      // 数量不足：物品留在当前章节，不生成任何记录
      setError(
        `数量不足：${form.fromHolder} 的「${form.name}」当前只剩 ${result.avail} 件，` +
          `还差 ${result.shortage} 件，物品仍留在当前章节。`
      );
    } else if (result.reason === 'same-holder') {
      setError('转出方与接收方是同一人，无需转手。');
    } else {
      setError('请完整选择物品、转出方、接收方和数量。');
    }
  };

  if (!names.length)
    return (
      <section className="empty">
        <div>◇</div>
        <h2>战利品台账</h2>
        <p>还没有章节登记战利品，新建章节时填写即可自动汇总。</p>
      </section>
    );

  return (
    <div className="loot-page">
      <section className="ledger-panel">
        <div className="panel-head">
          <span>CURRENT HOLDINGS</span>
          <h2>持有台账</h2>
          <p>同名物品按持有人分开统计，数量为扣除转手后的当前结余。</p>
        </div>
        <div className="loot-rows head">
          <div className="loot-row">
            <span>物品</span>
            <span>持有人</span>
            <b>数量</b>
          </div>
        </div>
        <div className="loot-rows">
          {stats.map((r) => (
            <div className="loot-row" key={r.name + r.holder}>
              <span className="loot-name">{r.name}</span>
              <span className="loot-holder">{r.holder}</span>
              <b>{r.qty > 0 ? `× ${r.qty}` : '已全数转出'}</b>
            </div>
          ))}
        </div>

        <div className="panel-head transfer-head">
          <span>TRANSFER</span>
          <h2>登记转手</h2>
          <p>在某一章把物品转给他人：旧章节保留当时的持有人，新章节接过后再更新。</p>
        </div>
        <div className="transfer-form">
          <label>
            物品
            <select value={form.name} onChange={(e) => pickName(e.target.value)}>
              <option value="">选择物品</option>
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            转出方
            <select
              value={form.fromHolder}
              onChange={(e) => setForm({ ...form, fromHolder: e.target.value })}
            >
              <option value="">选择持有人</option>
              {holders.map((h) => (
                <option key={h.holder} value={h.holder}>
                  {h.holder}（剩 {h.qty}）
                </option>
              ))}
            </select>
          </label>
          <label>
            接收方
            <select
              value={form.toHolder}
              onChange={(e) => setForm({ ...form, toHolder: e.target.value })}
            >
              <option value="">选择角色</option>
              {campaign.characters.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            数量
            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />
          </label>
          <label>
            计入章节
            <select value={sessionId} onChange={(e) => setSessionId(Number(e.target.value))}>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="err">{error}</p>}
          <button className="primary full" onClick={submit}>
            确认转手
          </button>
        </div>
      </section>

      <section className="history-panel">
        <div className="panel-head">
          <span>ITEM HISTORY</span>
          <h2>换手过程</h2>
          <p>每件物品按章节顺序的获得与转手记录。</p>
        </div>
        {names.map((name) => (
          <article className="history-card" key={name}>
            <h3>{name}</h3>
            {itemHistory(campaign, name).map((ev, i) => (
              <div className="history-event" key={i}>
                <span className={'dot ' + (ev.type === '转手' ? 'moved' : '')} />
                <div>
                  <b>
                    {ev.type === '转手'
                      ? `${ev.from} → ${ev.holder}`
                      : `${ev.holder} 获得`}
                    　× {ev.qty}
                  </b>
                  <small>
                    {ev.chapter} · {ev.date}
                  </small>
                </div>
              </div>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
}
