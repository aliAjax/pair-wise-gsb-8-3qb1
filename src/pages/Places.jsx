import React from 'react';

export default function Places({ places, campaign }) {
  return (
    <section className="ledger-page">
      <div className="section-note">
        战役「{campaign}」共涉及 {places.length} 个地点，同名地点已合并，按出现次数排序。
      </div>
      {places.length === 0 ? (
        <div className="empty-inline">还没有登记任何地点，在新建章节时填写途经地点即可入账。</div>
      ) : (
        <div className="place-grid">
          {places.map((p, i) => (
            <article className="place-card" key={p.name}>
              <div className="place-head">
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.name}</h3>
                <b>出现 {p.count} 次</b>
              </div>
              <div className="visits">
                {p.visits.map((v) => (
                  <span key={v.sessionId}>{v.title}<small>{v.date}</small></span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
