// Dashboard页面数据
const dashboardData = {
  stats: {
    todayOrders: 128,
    completedQty: 8542,
    abnormalReports: 23,
    equipmentFaults: 3
  },
  todayWorkRecords: [
    { id: 'WO-20240321-001', drawingNo: '763', process: '成型', operator: '张三', completedQty: 585, scrapQty: 15, status: 'completed', statusText: '已完成' },
    { id: 'WO-20240321-002', drawingNo: '665', process: '瓷检', operator: '李四', completedQty: 420, scrapQty: 8, status: 'in_progress', statusText: '进行中' },
    { id: 'WO-20240321-003', drawingNo: '801', process: '安装', operator: '王五', completedQty: 500, scrapQty: 0, status: 'completed', statusText: '已完成' },
    { id: 'WO-20240321-004', drawingNo: '763', process: '成型', operator: '张三', completedQty: 320, scrapQty: 45, status: 'error', statusText: '异常' }
  ]
};
