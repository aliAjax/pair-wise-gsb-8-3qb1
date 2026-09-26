import React from 'react';

const KIND_CLASS = { 获得: 'gain', 增补: 'add', 转手: 'move' };

// 一条结算后的战利品登记：数量不足时划线标出登记数并给出缺额徽标
export default function EntryRow({ entry, showChapter }) {
  return (
    <div className={'entry' + (entry.short > 0 ? ' has-short' : '')}>
      <div className="entry-top">
        <b>{entry.item}</b>
        <span className="qty">
          ×{entry.settled}
          {entry.qty !== entry.settled && <s>×{entry.qty}</s>}
        </span>
        <em className={'kind ' + (KIND_CLASS[entry.kind] || '')}>{entry.kind}</em>
        {entry.short > 0 && <i className="short-badge">少 {entry.short} 件</i>}
      </div>
      <div className="entry-sub">
        {showChapter && <span className="ch">{entry.title} · {entry.date}</span>}
        <span>
          {entry.holder} 持有
          {entry.from?.length > 0 && `，自 ${entry.from.map((f) => `${f.holder} ×${f.qty}`).join('、')} 转入`}
        </span>
      </div>
    </div>
  );
}
