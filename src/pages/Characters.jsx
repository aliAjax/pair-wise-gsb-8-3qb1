import React from 'react';

export default function Characters({ characters, holdings }) {
  return (
    <section className="cards">
      <div className="section-note">队伍中有 {characters.length} 位冒险者，以下为各角色当前持有的物品。</div>
      {characters.map((c) => {
        const held = holdings.get(c.name) || [];
        return (
          <article className="char-card" key={c.name}>
            <div className="card-top">
              <div className="avatar" style={{ background: c.color }}>{c.name[0]}</div>
              <div>
                <small>{c.role}</small>
                <h3>{c.name}</h3>
                <p>玩家 · {c.player}</p>
              </div>
            </div>
            <div className="holding">
              {held.length > 0 ? (
                <div className="chips">{held.map((h) => <span className="chip" key={h.item}>{h.item} ×{h.qty}</span>)}</div>
              ) : <p className="none">暂无持有物品</p>}
            </div>
          </article>
        );
      })}
    </section>
  );
}
