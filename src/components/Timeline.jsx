import React from 'react';
import { orderedSessions } from '../lib/ledger.js';

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });

export default function Timeline({ campaign, active, setActive, notify }) {
  const sessions = orderedSessions(campaign);
  const cur = sessions.find((s) => s.id === active) || sessions[0];
  const curIdx = sessions.findIndex((s) => s.id === cur?.id);

  return (
    <div className="timeline-layout">
      <section className="timeline">
        <div className="timeline-intro">
          <div>
            <span>THE CHRONICLE</span>
            <h2>记录每一次冒险</h2>
          </div>
          <span className="count">{sessions.length} CHAPTERS</span>
        </div>
        {sessions.map((s, i) => (
          <button
            className={'chapter ' + (cur?.id === s.id ? 'selected' : '')}
            onClick={() => setActive(s.id)}
            key={s.id}
          >
            <div className="date">
              <b>{fmtDate(s.date)}</b>
              <small>{new Date(s.date).getFullYear()}</small>
            </div>
            <div className="line">
              <span style={{ background: s.color }}></span>
              {i < sessions.length - 1 && <i />}
            </div>
            <div className="chapter-copy">
              <div className="tag">{s.tag}</div>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <div className="meta-line">
                ⌖ {(s.places || []).length} 地点 · ◇ {(s.loot || []).length} 条战利品
              </div>
            </div>
            <span className="arrow">↗</span>
          </button>
        ))}
      </section>

      <section className="detail-panel">
        <div className="detail-cover" style={{ background: cur?.color }}>
          <span>CHAPTER {String(curIdx + 1).padStart(2, '0')}</span>
          <i>✦</i>
        </div>
        <div className="detail-body">
          <span className="tag">{cur?.tag}</span>
          <h2>{cur?.title}</h2>
          <p>{cur?.summary}</p>
          <div className="meta-grid">
            <div>
              <small>游戏日期</small>
              <strong>{cur?.date}</strong>
            </div>
            <div>
              <small>参与者</small>
              <strong>{campaign.characters.length} 位玩家</strong>
            </div>
          </div>

          <div className="ledger-block">
            <small>本章地点</small>
            {cur?.places?.length ? (
              <div className="chips">
                {cur.places.map((p) => (
                  <span className="chip" key={p}>⌖ {p}</span>
                ))}
              </div>
            ) : (
              <p className="none">本章未登记地点</p>
            )}
          </div>

          <div className="ledger-block">
            <small>本章战利品</small>
            {cur?.loot?.length ? (
              <div className="loot-rows">
                {cur.loot.map((e) => (
                  <div className="loot-row" key={e.id}>
                    <span className="loot-name">{e.name}</span>
                    <span className="loot-holder">
                      {e.holder}
                      {e.from && <em>（自 {e.from.holder} 转手）</em>}
                    </span>
                    <b>× {e.qty}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="none">本章未登记战利品</p>
            )}
          </div>

          <div className="note">
            <span>✎</span>
            <div>
              <strong>笔记</strong>
              <p>点击编辑这一章节的剧情细节、重要决定和未解线索。</p>
            </div>
            <button onClick={() => notify('笔记编辑已开启')}>编辑</button>
          </div>
        </div>
      </section>
    </div>
  );
}
