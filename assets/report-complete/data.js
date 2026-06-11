// ========== Report-complete 页面数据 ==========

let reportRecordData = [
  { id: 'RP-001', drawingNo: '763', process: '成型',
    reportQty: 585, scrapQty: 15, qualifiedQty: 570,
    operator: '张三', workTime: '2024-03-22 09:30',
    equipment: '成型机A', batchNo: 'BATCH-001' },
  { id: 'RP-002', drawingNo: '665', process: '修理',
    reportQty: 420, scrapQty: 8, qualifiedQty: 412,
    operator: '李四', workTime: '2024-03-22 10:15',
    equipment: '修理台A', batchNo: 'BATCH-002' },
  { id: 'RP-003', drawingNo: '801', process: '安装',
    reportQty: 500, scrapQty: 0, qualifiedQty: 500,
    operator: '王五', workTime: '2024-03-22 08:45',
    equipment: '安装设备', batchNo: 'BATCH-003' },
  { id: 'RP-004', drawingNo: '763', process: '修理',
    reportQty: 320, scrapQty: 45, qualifiedQty: 275,
    operator: '张三', workTime: '2024-03-22 11:20',
    equipment: '修理台B', batchNo: 'BATCH-004' },
  { id: 'RP-005', drawingNo: '902', process: '包装',
    reportQty: 680, scrapQty: 12, qualifiedQty: 668,
    operator: '赵六', workTime: '2024-03-22 12:30',
    equipment: '包装机A', batchNo: 'BATCH-005' },
  { id: 'RP-006', drawingNo: '784', process: '上釉',
    reportQty: 380, scrapQty: 5, qualifiedQty: 375,
    operator: '钱七', workTime: '2024-03-21 13:10',
    equipment: '上釉设备A', batchNo: 'BATCH-006' },
  { id: 'RP-007', drawingNo: '665', process: '瓷检',
    reportQty: 500, scrapQty: 3, qualifiedQty: 497,
    operator: '李四', workTime: '2024-03-21 17:00',
    equipment: '瓷检设备B', batchNo: 'BATCH-007' },
];

// 中间子表(自动拆分的报工明细,实现计划与报工的多对多关系)
let planReportDetailData = [
  // 报工 RP-001: 585件成型,来自生产订单 PO-20240321-001
  { id: 'PRD-001', planOrderId: 'PO-20240321-001', reportId: 'RP-001',
    drawingNo: '763', process: '成型',
    qty: 585, scrapQty: 15, qualifiedQty: 570,
    createTime: '2024-03-22 09:30' },

  // 报工 RP-002: 420件瓷检,来自生产订单 PO-20240321-002
  { id: 'PRD-002', planOrderId: 'PO-20240321-002', reportId: 'RP-002',
    drawingNo: '665', process: '瓷检',
    qty: 420, scrapQty: 8, qualifiedQty: 412,
    createTime: '2024-03-22 10:15' },

  // 报工 RP-003: 500件安装,来自生产订单 PO-20240321-003
  { id: 'PRD-003', planOrderId: 'PO-20240321-003', reportId: 'RP-003',
    drawingNo: '801', process: '安装',
    qty: 500, scrapQty: 0, qualifiedQty: 500,
    createTime: '2024-03-22 08:45' },

  // 报工 RP-004: 320件成型,来自生产订单 PO-20240322-001
  { id: 'PRD-004', planOrderId: 'PO-20240322-001', reportId: 'RP-004',
    drawingNo: '763', process: '成型',
    qty: 320, scrapQty: 45, qualifiedQty: 275,
    createTime: '2024-03-22 11:20' },

  // 报工 RP-005: 680件包装,来自生产订单 PO-20240322-001
  { id: 'PRD-005', planOrderId: 'PO-20240322-001', reportId: 'RP-005',
    drawingNo: '902', process: '包装',
    qty: 680, scrapQty: 12, qualifiedQty: 668,
    createTime: '2024-03-22 12:30' },

  // 报工 RP-006: 380件成型,来自生产订单 PO-20240322-002
  { id: 'PRD-006', planOrderId: 'PO-20240322-002', reportId: 'RP-006',
    drawingNo: '784', process: '成型',
    qty: 380, scrapQty: 5, qualifiedQty: 375,
    createTime: '2024-03-21 13:10' },

  // 报工 RP-007: 500件瓷检,来自生产订单 PO-20240321-002
  { id: 'PRD-007', planOrderId: 'PO-20240321-002', reportId: 'RP-007',
    drawingNo: '665', process: '瓷检',
    qty: 500, scrapQty: 3, qualifiedQty: 497,
    createTime: '2024-03-21 17:00' },
];

