// 战役初始资料：每章登记地点（places）与战利品（loot）。
// loot 条目：{ id, name, holder, qty, from? }
// from 表示该批物品是本章从别人手中转来的，旧章节的记录保持不动。
export const seed = {
  name: '暮光边境',
  system: 'D&D 5E',
  sessions: [
    {
      id: 1,
      date: '2024-06-08',
      title: '第一章：灰港的钟声',
      summary: '队伍抵达灰港，在失落的钟楼发现了神秘符文。',
      tag: '主线',
      color: '#d8a153',
      places: ['灰港', '失落钟楼'],
      loot: [
        { id: 'L1', name: '灰港守卫徽章', holder: '艾德里安', qty: 2 },
        { id: 'L2', name: '古老铜币', holder: '莫尔', qty: 1 },
      ],
    },
    {
      id: 2,
      date: '2024-06-15',
      title: '第二章：雾中来客',
      summary: '与流浪法师伊琳结盟，追踪海雾中的脚印。',
      tag: '主线',
      color: '#93b7a6',
      places: ['灰港', '雾林'],
      loot: [
        { id: 'L3', name: '海雾珍珠', holder: '瑟琳', qty: 1 },
        { id: 'L4', name: '灰港守卫徽章', holder: '瑟琳', qty: 1, from: { holder: '艾德里安' } },
      ],
    },
    {
      id: 3,
      date: '2024-06-22',
      title: '支线：深林采药',
      summary: '帮助村民寻找月光草，获得一枚古老铜币。',
      tag: '支线',
      color: '#b9a6d1',
      places: ['雾林', '深林村落'],
      loot: [
        { id: 'L5', name: '月光草', holder: '瑟琳', qty: 3 },
        { id: 'L6', name: '古老铜币', holder: '艾德里安', qty: 1 },
      ],
    },
  ],
  characters: [
    { name: '艾德里安', role: '圣骑士', player: '林默', color: '#d8a153' },
    { name: '瑟琳', role: '游侠', player: '安然', color: '#93b7a6' },
    { name: '莫尔', role: '术士', player: '周岳', color: '#b9a6d1' },
  ],
};
