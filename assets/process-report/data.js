// ========== Process-report 页面数据 ==========

let processReportData = [
  {
    orderId: 'PO-20240321-001',
    drawingNo: '763',
    productName: '绝缘子',
    planQuantity: 600,
    totalQualified: 570,
    totalLoss: 30,
    processes: {
      '成型': { qualified: 590, loss: 10 },
      '修理': { qualified: 588, loss: 2 },
      '生检': { qualified: 586, loss: 2 },
      '上釉': { qualified: 584, loss: 2 },
      '装车': { qualified: 582, loss: 2 },
      '瓷检': { qualified: 579, loss: 3 },
      '安装': { qualified: 576, loss: 3 },
      '拉力': { qualified: 574, loss: 2 },
      '电检': { qualified: 572, loss: 2 },
      '包装': { qualified: 570, loss: 2 }
    }
  },
  {
    orderId: 'PO-20240321-002',
    drawingNo: '764',
    productName: '套管',
    planQuantity: 400,
    totalQualified: 385,
    totalLoss: 15,
    processes: {
      '成型': { qualified: 395, loss: 5 },
      '修理': { qualified: 393, loss: 2 },
      '生检': { qualified: 392, loss: 1 },
      '上釉': { qualified: 391, loss: 1 },
      '装车': { qualified: 390, loss: 1 },
      '瓷检': { qualified: 388, loss: 2 },
      '安装': { qualified: 387, loss: 1 },
      '拉力': { qualified: 386, loss: 1 },
      '电检': { qualified: 385, loss: 1 },
      '包装': { qualified: 385, loss: 0 }
    }
  },
  {
    orderId: 'PO-20240321-003',
    drawingNo: '765',
    productName: '金具',
    planQuantity: 500,
    totalQualified: 480,
    totalLoss: 20,
    processes: {
      '成型': { qualified: 495, loss: 5 },
      '修理': { qualified: 492, loss: 3 },
      '生检': { qualified: 490, loss: 2 },
      '上釉': { qualified: 489, loss: 1 },
      '装车': { qualified: 487, loss: 2 },
      '瓷检': { qualified: 485, loss: 2 },
      '安装': { qualified: 483, loss: 2 },
      '拉力': { qualified: 482, loss: 1 },
      '电检': { qualified: 481, loss: 1 },
      '包装': { qualified: 480, loss: 1 }
    }
  }
];

