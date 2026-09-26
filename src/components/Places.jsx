import React from 'react';
import { placeStats } from '../lib/ledger.js';

export default function Places({ campaign }) {
  const stats = placeStats(campaign);
  if (!stats.length)
    return (
      <section className="empty">
        <div>⌖</div>
        <h2>地点图鉴</h2>
        <p>还没有章节登记地点，新建章节时填写即可自动汇总。</p>
      </section>
    );
  return (
    <section className="places">
      <div className="section-note">
        同名地点已合并，共 {stats.length} 处地点。数字为该地点出现过的章节数。
      </div>
      {stats.map((p, i) => (
        <article className="place-row" key={p.name}>
          <span className="rank">{String(i + 1).padStart(2, '0')}</span>
          <div className="place-main">
            <h3>{p.name}</h3>
            <p>{p.chapters.join(' · ')}</p>
          </div>
          <span className="stat-badge">出现于 {p.count} 章</span>
        </article>
      ))}
    </section>
  );
}
