import React from 'react';

export default function Characters({ campaign, notify }) {
  return (
    <section className="cards">
      <div className="section-note">
        队伍中有 {campaign.characters.length} 位冒险者，点击卡片查看角色档案。
      </div>
      {campaign.characters.map((c) => (
        <article className="char-card" key={c.name}>
          <div className="avatar" style={{ background: c.color }}>{c.name[0]}</div>
          <div>
            <small>{c.role}</small>
            <h3>{c.name}</h3>
            <p>玩家 · {c.player}</p>
          </div>
          <button onClick={() => notify(`${c.name} 的角色档案`)}>↗</button>
        </article>
      ))}
    </section>
  );
}
