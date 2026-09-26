import React from 'react';
import EntryRow from '../components/EntryRow';

export default function Timeline({ sessions, active, onSelect, entries, players }) {
  const cur = sessions.find((s) => s.id === active);
  const no = sessions.findIndex((s) => s.id === active) + 1;
  return (
    <div className="timeline-layout">
      <section className="timeline">
        <div className="timeline-intro">
          <div><span>THE CHRONICLE</span><h2>记录每一次冒险</h2></div>
          <span className="count">{sessions.length} CHAPTERS</span>
        </div>
        {sessions.map((s, i) => (
          <button className={'chapter ' + (active === s.id ? 'selected' : '')} onClick={() => onSelect(s.id)} key={s.id}>
            <div className="date">
              <b>{new Date(s.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}</b>
              <small>{new Date(s.date).getFullYear()}</small>
            </div>
            <div className="line"><span style={{ background: s.color }}></span>{i < sessions.length - 1 && <i />}</div>
            <div className="chapter-copy">
              <div className="tag">{s.tag}</div>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <div className="chapter-meta">
                {(s.places || []).length > 0 && <span>⌖ {s.places.join(' · ')}</span>}
                {(s.loot || []).length > 0 && <span>◇ {s.loot.length} 条登记</span>}
              </div>
            </div>
            <span className="arrow">↗</span>
          </button>
        ))}
      </section>
      <section className="detail-panel">
        <div className="detail-cover" style={{ background: cur?.color }}>
          <span>CHAPTER {String(no).padStart(2, '0')}</span><i>✦</i>
        </div>
        <div className="detail-body">
          <span className="tag">{cur?.tag}</span>
          <h2>{cur?.title}</h2>
          <p>{cur?.summary}</p>
          <div className="meta-grid">
            <div><small>游戏日期</small><strong>{cur?.date}</strong></div>
            <div><small>参与者</small><strong>{players} 位玩家</strong></div>
          </div>
          <div className="ledger-block">
            <h4>途经地点</h4>
            {(cur?.places || []).length > 0 ? (
              <div className="chips">{cur.places.map((p) => <span className="chip" key={p}>⌖ {p}</span>)}</div>
            ) : <p className="none">本章未登记地点</p>}
          </div>
          <div className="ledger-block">
            <h4>战利品登记</h4>
            {entries.length > 0
              ? entries.map((e, i) => <EntryRow key={i} entry={e} />)
              : <p className="none">本章未登记战利品</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
