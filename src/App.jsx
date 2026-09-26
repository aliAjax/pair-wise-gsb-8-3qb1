import React, { useEffect, useState } from 'react';
import { loadCampaign, saveCampaign } from './lib/storage.js';
import Timeline from './components/Timeline.jsx';
import Characters from './components/Characters.jsx';
import Places from './components/Places.jsx';
import Loot from './components/Loot.jsx';
import NewChapter from './components/NewChapter.jsx';

const TABS = [
  ['timeline', '◌', '时间线'],
  ['characters', '♙', '角色与阵营'],
  ['places', '⌖', '地点图鉴'],
  ['loot', '◇', '战利品'],
];
const TITLES = {
  timeline: '战役时间线',
  characters: '角色与阵营',
  places: '地点图鉴',
  loot: '战利品台账',
};

export default function App() {
  const [data, setData] = useState(loadCampaign);
  const [tab, setTab] = useState('timeline');
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => saveCampaign(data), [data]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  const addChapter = (chapter) => {
    setData({ ...data, sessions: [...data.sessions, chapter] });
    setActive(chapter.id);
    setShow(false);
    setNotice('新章节已加入时间线');
  };

  const exportData = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    );
    a.download = 'campaign.json';
    a.click();
    setNotice('战役记录已导出');
  };

  return (
    <div className="shell">
      <aside>
        <div className="logo"><span>✦</span> CAMPAIGNER</div>
        <div className="campaign">
          <small>当前战役</small>
          <strong>{data.name}</strong>
          <span>{data.system} · 2024</span>
        </div>
        <nav>
          {TABS.map(([id, i, t]) => (
            <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>
              <i>{i}</i>{t}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <button>⚙ 偏好设置</button>
          <small>本地存储已开启</small>
        </div>
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
          <Timeline campaign={data} active={active} setActive={setActive} notify={setNotice} />
        )}
        {tab === 'characters' && <Characters campaign={data} notify={setNotice} />}
        {tab === 'places' && <Places campaign={data} />}
        {tab === 'loot' && <Loot campaign={data} onChange={setData} notify={setNotice} />}
      </main>

      {show && (
        <NewChapter campaign={data} onSave={addChapter} onClose={() => setShow(false)} />
      )}
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}
