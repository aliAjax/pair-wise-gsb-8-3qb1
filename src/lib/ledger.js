// 结算规则：地点合并、物品结余、转手与统计的纯函数，不碰 UI 和存储。

const lootOf = (s) => s.loot || [];
const placesOf = (s) => s.places || [];

/** 章节按游戏日期（再按 id）排序，作为台账的时间轴 */
export const orderedSessions = (campaign) =>
  [...campaign.sessions].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

/** 某持有人在截至第 idx 章（含）时某物品的结余：累计获得 − 累计转出 */
export function balanceAt(sessions, name, holder, uptoIdx) {
  let bal = 0;
  sessions.forEach((s, i) => {
    if (i > uptoIdx) return;
    lootOf(s).forEach((e) => {
      if (e.name !== name) return;
      if (e.holder === holder) bal += e.qty;
      if (e.from && e.from.holder === holder) bal -= e.qty;
    });
  });
  return bal;
}

/**
 * 转手：在目标章节新增一条持有记录（from 指向原持有人），
 * 旧章节的记录保持当时的持有人不变。
 * 数量不足时不改动任何数据，返回 shortage 表示还差几件。
 */
export function transferLoot(campaign, { name, fromHolder, toHolder, qty, toSessionId }) {
  qty = Number(qty);
  if (!name || !fromHolder || !toHolder || !(qty > 0)) return { ok: false, reason: 'invalid' };
  if (fromHolder === toHolder) return { ok: false, reason: 'same-holder' };
  const sessions = orderedSessions(campaign);
  const idx = sessions.findIndex((s) => s.id === toSessionId);
  if (idx < 0) return { ok: false, reason: 'no-session' };
  const avail = balanceAt(sessions, name, fromHolder, idx);
  if (qty > avail) return { ok: false, reason: 'shortage', avail, shortage: qty - avail };
  const entry = { id: `L${Date.now()}`, name, holder: toHolder, qty, from: { holder: fromHolder } };
  const next = {
    ...campaign,
    sessions: campaign.sessions.map((s) =>
      s.id === toSessionId ? { ...s, loot: [...lootOf(s), entry] } : s
    ),
  };
  return { ok: true, campaign: next };
}

/** 地点图鉴：同名地点合并，统计出现过的章节数与章节清单 */
export function placeStats(campaign) {
  const map = new Map();
  orderedSessions(campaign).forEach((s) => {
    placesOf(s).forEach((p) => {
      if (!map.has(p)) map.set(p, { name: p, count: 0, chapters: [] });
      const st = map.get(p);
      st.count += 1;
      st.chapters.push(s.title);
    });
  });
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh')
  );
}

/** 战利品台账：同名物品按持有人分开统计当前结余 */
export function lootStats(campaign) {
  const map = new Map();
  const bump = (name, holder, delta) => {
    const key = `${name} ${holder}`;
    if (!map.has(key)) map.set(key, { name, holder, qty: 0 });
    map.get(key).qty += delta;
  };
  orderedSessions(campaign).forEach((s) =>
    lootOf(s).forEach((e) => {
      bump(e.name, e.holder, e.qty);
      if (e.from) bump(e.name, e.from.holder, -e.qty);
    })
  );
  return [...map.values()].sort(
    (a, b) => a.name.localeCompare(b.name, 'zh') || b.qty - a.qty
  );
}

/** 战役中出现过（含已全数转出）的所有物品名 */
export function itemNames(campaign) {
  const names = new Set();
  campaign.sessions.forEach((s) => lootOf(s).forEach((e) => names.add(e.name)));
  return [...names].sort((a, b) => a.localeCompare(b, 'zh'));
}

/** 某件物品的换手过程：按章节顺序列出每一次获得与转手 */
export function itemHistory(campaign, name) {
  const events = [];
  orderedSessions(campaign).forEach((s) => {
    lootOf(s).forEach((e) => {
      if (e.name !== name) return;
      events.push({
        chapter: s.title,
        date: s.date,
        type: e.from ? '转手' : '获得',
        holder: e.holder,
        qty: e.qty,
        from: e.from ? e.from.holder : null,
      });
    });
  });
  return events;
}
