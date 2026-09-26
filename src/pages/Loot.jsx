import React from 'react';
import EntryRow from '../components/EntryRow';

export default function Loot({ items, campaign }) {
  return (
    <section className="ledger-page">
      <div className="section-note">
        战役「{campaign}」共登记 {items.length} 种物品；同名物品按持有人分开统计，转手数量不足时按实有量结算并标注缺额。
      </div>
      {items.length === 0 ? (
        <div className="empty-inline">还没有登记任何战利品，在新建章节时添加物品即可入账。</div>
      ) : (
        <div className="item-grid">
          {items.map((it) => (
            <article className="item-card" key={it.name}>
              <div className="item-head">
                <h3>{it.name}</h3>
                <span className="count">现存 ×{it.total}</span>
              </div>
              <div className="chips">
                {it.holders.map((h) => <span className="chip" key={h.holder}>{h.holder} ×{h.qty}</span>)}
              </div>
              <div className="history">
                <h5>换手过程</h5>
                {it.history.map((h, i) => <EntryRow key={i} entry={h} showChapter />)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
