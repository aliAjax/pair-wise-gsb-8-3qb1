import React, { useEffect, useMemo, useState } from 'react';
import { loadCampaign, saveCampaign } from './storage';
import { settleLoot, collectPlaces, holdingsByCharacter } from './ledger';
import Timeline from './pages/Timeline';
import Characters from './pages/Characters';
import Places from './pages/Places';
import Loot from './pages/Loot';
import NewChapter from './components/NewChapter';

const TABS = [
  ['timeline', '◌', '时间线'],
  ['characters', '♙', '角色与阵营'],
  ['places', '⌖', '地点图鉴'],
  ['loot', '◇', '战利品'],
];
const TITLES = { timeline: '战役时间线', characters: '角色与阵营', places: '地点图鉴', loot: '战利品台账' };
const PALETTE = ['#d8a153', '#93b7a6', '#b9a6d1'];

export default function App() {
  const [data, setData] = useState(loadCampaign);
  const [tab, setTab] = useState('timeline');
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => saveCampaign(data), [data]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const ledger = useMemo(() => settleLoot(data.sessions), [data.sessions]);
  const places = useMemo(() => collectPlaces(data.sessions), [data.sessions]);
  const holdings = useMemo(() => holdingsByCharacter(ledger), [ledger]);
  const cur = ledger.ordered.find((s) => s.id === active) || ledger.ordered[0];

  const addChapter = (s) => {
    const session = { ...s, color: PALETTE[data.sessions.length % PALETTE.length] };
    setData({ ...data, sessions: [...data.sessions, session] });
    setActive(session.id);
    setTab('timeline');
    setShow(false);
    setNotice('新章节已加入时间线，地点与战利品已入账');
  };

  const exportData = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = 'campaign.json';
    a.click();
    setNotice('战役记录已导出');
  };

  return (
    <div className="shell">
      <aside>
        <div className="logo"><span>✦</span> CAMPAIGNER</div>
        <div className="campaign"><small>当前战役</small><strong>{data.name}</strong><span>{data.system} · 2024</span></div>
        <nav>
          {TABS.map(([id, i, t]) => (
            <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}><i>{i}</i>{t}</button>
          ))}
        </nav>
        <div className="side-bottom"><button>⚙ 偏好设置</button><small>本地存储已开启</small></div>
      </aside>
      <main>
        <header>
          <div>
            <span className="crumb">MY CAMPAIGN / {data.system}</span>
            <h1>{TITLES[tab]}</h1>
          </div>
          <div className="actions">
            <button onClick={exportData} className="outline">↓ 导出</button>
            <button onClick={() => setShow(true)} className="primary">＋ 新建章节</button>
          </div>
        </header>
        {tab === 'timeline' && (
          <Timeline
            sessions={ledger.ordered}
            active={cur?.id}
            onSelect={setActive}
            entries={ledger.bySession.get(cur?.id) || []}
            players={data.characters.length}
          />
        )}
        {tab === 'characters' && <Characters characters={data.characters} holdings={holdings} />}
        {tab === 'places' && <Places places={places} campaign={data.name} />}
        {tab === 'loot' && <Loot items={ledger.items} campaign={data.name} />}
      </main>
      {show && <NewChapter characters={data.characters} onSave={addChapter} onClose={() => setShow(false)} />}
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}
