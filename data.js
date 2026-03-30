/**
 * 渡邊組 工事情報ホワイトボード
 * モックデータ
 * 
 * 本番環境では kintone API / X-point API から取得
 */

const MOCK_PROJECTS = [
  {
    id: "WG-2026-001",
    name: "○○工事",
    person: "渡邊 一郎",
    department: "工事部",
    startDate: "2026-01-10",
    endDate: "2027-03-31",
    contractAmount: 100000000,
    performanceBudget: 15000000,
    progress: 10,
    risk: "low",
    grossMargin: 8500000,
    status: "進行中",
    kintoneRecordId: "101",
    xpointFormId: "FRM-001",
    workflow: {
      status: "日程調整中",
      approver: "鈴木 部長",
      lastUpdated: "2026-03-25",
      steps: [
        { name: "工事日誌", status: "完了" },
        { name: "安全日誌", status: "完了" },
        { name: "KY記録簿", status: "進行中" },
      ]
    },
    photos: [
      { label: "現場全景", date: "2026-03-20" },
      { label: "基礎工事", date: "2026-03-15" },
      { label: "安全対策", date: "2026-03-10" },
    ]
  },
  {
    id: "WG-2026-002",
    name: "△△工事",
    person: "佐藤 次郎",
    department: "工事部",
    startDate: "2026-01-10",
    endDate: "2027-03-31",
    contractAmount: 150000000,
    performanceBudget: 25000000,
    progress: 12,
    risk: "mid",
    grossMargin: 12000000,
    status: "進行中",
    kintoneRecordId: "102",
    xpointFormId: "FRM-002",
    workflow: {
      status: "承認済み",
      approver: "田中 課長",
      lastUpdated: "2026-03-22",
      steps: [
        { name: "工事日誌", status: "完了" },
        { name: "安全日誌", status: "完了" },
        { name: "KY記録簿", status: "完了" },
      ]
    },
    photos: [
      { label: "外壁工事", date: "2026-03-18" },
      { label: "配管作業", date: "2026-03-12" },
      { label: "検査記録", date: "2026-03-05" },
    ]
  },
  {
    id: "WG-2026-003",
    name: "□□工事",
    person: "高橋 三郎",
    department: "土木部",
    startDate: "2026-01-10",
    endDate: "2027-03-31",
    contractAmount: 100000000,
    performanceBudget: 15000000,
    progress: 8,
    risk: "low",
    grossMargin: 7500000,
    status: "進行中",
    kintoneRecordId: "103",
    xpointFormId: "FRM-003",
    workflow: {
      status: "申請中",
      approver: "山本 部長",
      lastUpdated: "2026-03-20",
      steps: [
        { name: "工事日誌", status: "完了" },
        { name: "安全日誌", status: "進行中" },
        { name: "KY記録簿", status: "未着手" },
      ]
    },
    photos: [
      { label: "掘削工事", date: "2026-03-19" },
      { label: "排水作業", date: "2026-03-14" },
      { label: "測量記録", date: "2026-03-08" },
    ]
  },
  {
    id: "WG-2026-004",
    name: "◇◇工事",
    person: "中村 四郎",
    department: "土木部",
    startDate: "2026-02-01",
    endDate: "2027-03-31",
    contractAmount: 200000000,
    performanceBudget: 30000000,
    progress: 5,
    risk: "high",
    grossMargin: 15000000,
    status: "進行中",
    kintoneRecordId: "104",
    xpointFormId: "FRM-004",
    workflow: {
      status: "差し戻し",
      approver: "伊藤 部長",
      lastUpdated: "2026-03-28",
      steps: [
        { name: "工事日誌", status: "進行中" },
        { name: "安全日誌", status: "未着手" },
        { name: "KY記録簿", status: "未着手" },
      ]
    },
    photos: [
      { label: "鉄骨組立", date: "2026-03-22" },
      { label: "コンクリート打設", date: "2026-03-16" },
      { label: "品質検査", date: "2026-03-10" },
    ]
  },
  {
    id: "WG-2026-005",
    name: "☆☆工事",
    person: "山田 五郎",
    department: "建築部",
    startDate: "2026-03-01",
    endDate: "2027-03-31",
    contractAmount: 80000000,
    performanceBudget: 12000000,
    progress: 3,
    risk: "low",
    grossMargin: 6000000,
    status: "着手準備",
    kintoneRecordId: "105",
    xpointFormId: "FRM-005",
    workflow: {
      status: "承認済み",
      approver: "鈴木 部長",
      lastUpdated: "2026-03-26",
      steps: [
        { name: "工事日誌", status: "未着手" },
        { name: "安全日誌", status: "未着手" },
        { name: "KY記録簿", status: "未着手" },
      ]
    },
    photos: [
      { label: "着工前写真", date: "2026-03-25" },
      { label: "用地確認", date: "2026-03-20" },
      { label: "搬入経路", date: "2026-03-15" },
    ]
  }
];
