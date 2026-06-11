// ========== Report-receive 页面数据 ==========

let receiveData = [
  { id:'RCV-001', drawingNo:'763', productName:'产品A', receiveProcess:'成型', previousProcess:'榨泥',
    qty:600, acceptQty:598, rejectQty:2, status:'received', statusText:'已接收',
    operator:'张三', time:'2024-03-22 08:30', remark:'' },
  { id:'RCV-002', drawingNo:'665', productName:'产品B', receiveProcess:'修理', previousProcess:'成型',
    qty:800, acceptQty:0, rejectQty:0, status:'pending', statusText:'待接收',
    operator:'李四', time:'2024-03-22 09:15', remark:'' },
  { id:'RCV-003', drawingNo:'801', productName:'产品C', receiveProcess:'生检', previousProcess:'修理',
    qty:500, acceptQty:500, rejectQty:0, status:'received', statusText:'已接收',
    operator:'王五', time:'2024-03-22 07:45', remark:'' },
  { id:'RCV-004', drawingNo:'784', productName:'产品D', receiveProcess:'上釉', previousProcess:'生检',
    qty:1200, acceptQty:1150, rejectQty:50, status:'exception', statusText:'异常',
    operator:'赵六', time:'2024-03-22 10:05', remark:'来料短缺50件' },
  { id:'RCV-005', drawingNo:'902', productName:'产品E', receiveProcess:'装车', previousProcess:'上釉',
    qty:400, acceptQty:0, rejectQty:0, status:'pending', statusText:'待接收',
    operator:'孙七', time:'2024-03-22 10:30', remark:'' },
  { id:'RCV-006', drawingNo:'763', productName:'产品A', receiveProcess:'瓷检', previousProcess:'装车',
    qty:300, acceptQty:298, rejectQty:2, status:'received', statusText:'已接收',
    operator:'张三', time:'2024-03-21 16:20', remark:'' },
  { id:'RCV-007', drawingNo:'665', productName:'产品B', receiveProcess:'安装', previousProcess:'瓷检',
    qty:600, acceptQty:600, rejectQty:0, status:'received', statusText:'已接收',
    operator:'李四', time:'2024-03-21 14:50', remark:'' },
];

