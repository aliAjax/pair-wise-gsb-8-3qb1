// 战役种子数据：每章登记途经地点与战利品（名称、持有人、数量）。
export const seed = {
  name: '暮光边境',
  system: 'D&D 5E',
  sessions: [
    {
      id: 1, date: '2024-06-08', title: '第一章：灰港的钟声', tag: '主线', color: '#d8a153',
      summary: '队伍抵达灰港，在失落的钟楼发现了神秘符文。',
      places: ['灰港', '失落钟楼'],
      loot: [
        { item: '灰港守卫徽章', holder: '艾德里安', qty: 2 },
        { item: '治疗药水', holder: '瑟琳', qty: 3 },
      ],
    },
    {
      id: 2, date: '2024-06-15', title: '第二章：雾中来客', tag: '主线', color: '#93b7a6',
      summary: '与流浪法师伊琳结盟，追踪海雾中的脚印。',
      places: ['灰港', '雾林'],
      loot: [
        { item: '治疗药水', holder: '莫尔', qty: 2 },
        { item: '雾纹罗盘', holder: '瑟琳', qty: 1 },
      ],
    },
    {
      id: 3, date: '2024-06-22', title: '支线：深林采药', tag: '支线', color: '#b9a6d1',
      summary: '帮助村民寻找月光草，获得一枚古老铜币。',
      places: ['雾林', '月影谷'],
      loot: [
        { item: '月光草', holder: '莫尔', qty: 3 },
        { item: '古老铜币', holder: '艾德里安', qty: 1 },
      ],
    },
    {
      id: 4, date: '2024-06-29', title: '第三章：月下集市', tag: '主线', color: '#d8a153',
      summary: '在集市清点物资，莫尔把月光草交给瑟琳调配药剂。',
      places: ['灰港', '月下集市'],
      loot: [
        { item: '月光草', holder: '瑟琳', qty: 5 },
        { item: '古老铜币', holder: '瑟琳', qty: 1 },
      ],
    },
  ],
  characters: [
    { name: '艾德里安', role: '圣骑士', player: '林默', color: '#d8a153' },
    { name: '瑟琳', role: '游侠', player: '安然', color: '#93b7a6' },
    { name: '莫尔', role: '术士', player: '周岳', color: '#b9a6d1' },
  ],
};
