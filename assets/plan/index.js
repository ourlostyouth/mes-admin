// ========== Plan 页面函数 ==========

function autoCreateTransfer(reportRecord) {
  const nextProcess = processFlowConfig[reportRecord.process];

  if (!nextProcess) {
    console.log(`工序 ${reportRecord.process} 没有配置下一道工序，不自动创建移交记录`);
    return;
  }

  // 创建移交下道记录
  const transferId = `TSF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

  const transferRecord = {
    id: transferId,
    drawingNo: reportRecord.drawingNo,
    fromProcess: reportRecord.process,
    toProcess: nextProcess,
    qty: reportRecord.qualifiedQty,
    status: 'waiting',
    statusText: '待移交',
    fromOp: reportRecord.operator,
    toOp: '', // 待指定接收人
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    remark: `自动关联完工汇报 ${reportRecord.id}`
  };

  transferData.push(transferRecord);

  // 自动建立关联关系
  const relationId = `TRR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

  transferReportRelationData.push({
    id: relationId,
    transferId: transferId,
    reportId: reportRecord.id,
    drawingNo: reportRecord.drawingNo,
    qty: reportRecord.qualifiedQty,
    createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
  });

  console.log(`自动创建移交记录 ${transferId} 并关联完工汇报 ${reportRecord.id}`);

  // 刷新移交下道表格
  renderTransferTable(transferData);

  return transferId;
}

function renderPlanTable(data = planOrderData) {
  const tbody = document.getElementById('planTableBody');
  if (!tbody) return;

  const priorityMap = { '高': 'error', '中': 'warning', '低': 'normal' };
  const statusMap = { '进行中': 'warning', '已完成': 'normal', '已取消': 'error' };

  tbody.innerHTML = data.map(plan => {
    const progress = plan.planQty > 0 ? ((plan.completedQty / plan.planQty) * 100).toFixed(1) : 0;
    return `
    <tr>
      <td><strong>${plan.id}</strong></td>
      <td>${plan.erpOrderId}</td>
      <td>${plan.drawingNo}</td>
      <td>${plan.productName}</td>
      <td><span class="status-badge ${priorityMap[plan.priority]}">${plan.priority}</span></td>
      <td>${plan.planQty}</td>
      <td>${plan.completedQty}</td>
      <td style="color:${plan.scrapQty>0?'#991b1b':'#1a1a1a'}">${plan.scrapQty}</td>
      <td>${progress}%</td>
      <td><span class="status-badge ${statusMap[plan.status]}">${plan.status}</span></td>
      <td>${plan.syncTime}</td>
      <td>
        <a class="action-link" onclick="viewPlanReportRelation('${plan.id}')">查看报工</a>
      </td>
    </tr>
  `}).join('');
}

function searchPlanData() {
  const kw = document.getElementById('planSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderPlanTable(planOrderData);
    return;
  }
  const filtered = planOrderData.filter(d =>
    d.erpOrderId.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw) ||
    d.productName.toLowerCase().includes(kw)
  );
  renderPlanTable(filtered);
}

function viewPlanReportRelation(planOrderId) {
  const plan = planOrderData.find(p => p.id === planOrderId);
  if (!plan) return;

  // 设置标题
  document.getElementById('relationModalTitle').textContent = `计划与报工关联 - ${plan.id}`;

  // 显示计划信息
  document.getElementById('relationPlanInfo').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
      <div><strong>生产订单:</strong> ${plan.id}</div>
      <div><strong>ERP订单:</strong> ${plan.erpOrderId}</div>
      <div><strong>图号:</strong> ${plan.drawingNo}</div>
      <div><strong>产品名称:</strong> ${plan.productName}</div>
      <div><strong>优先级:</strong> ${plan.priority}</div>
      <div><strong>状态:</strong> ${plan.status}</div>
      <div><strong>计划数量:</strong> ${plan.planQty}</div>
      <div><strong>完成数量:</strong> ${plan.completedQty}</div>
      <div><strong>报废数量:</strong> ${plan.scrapQty}</div>
      <div><strong>完成率:</strong> ${((plan.completedQty/plan.planQty)*100).toFixed(1)}%</div>
      <div><strong>开始时间:</strong> ${plan.startDate}</div>
      <div><strong>结束时间:</strong> ${plan.endDate}</div>
    </div>
  `;

  // 查找关联的中间子表数据
  const details = planReportDetailData.filter(d => d.planOrderId === planOrderId);

  // 查找关联的报工记录(去重)
  const relatedReportIds = [...new Set(details.map(d => d.reportId))];
  const relatedReports = reportRecordData.filter(r => relatedReportIds.includes(r.id));

  // 渲染关联的报工记录表格
  document.getElementById('relationReportTable').innerHTML = relatedReports.length > 0 ?
    relatedReports.map(r => {
      const reportDetail = details.find(d => d.reportId === r.id);
      return `
      <tr>
        <td><strong><a class="action-link" onclick="switchModule('report-complete'); setTimeout(() => scrollToReport('${r.id}'), 100);">${r.id}</a></strong></td>
        <td>${r.process}</td>
        <td>${r.reportQty}</td>
        <td>${r.qualifiedQty}</td>
      </tr>
    `}).join('') :
    '<tr><td colspan="4" style="text-align:center;color:#64748b;">暂无关联报工</td></tr>';

  // 渲染中间子表明细表格
  document.getElementById('relationDetailTable').innerHTML = details.length > 0 ?
    details.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${d.reportId}</td>
        <td>${d.drawingNo}</td>
        <td>${d.process}</td>
        <td>${d.qty}</td>
        <td>${d.qualifiedQty}</td>
        <td>${d.createTime}</td>
      </tr>
    `).join('') :
    '<tr><td colspan="7" style="text-align:center;color:#64748b;">暂无拆分明细</td></tr>';

  // 显示弹窗
  document.getElementById('planReportRelationModal').style.display = 'flex';
}

function closeRelationModal() {
  document.getElementById('planReportRelationModal').style.display = 'none';
}

function showRelatedPlans(type, recordId, drawingNo) {
  currentManualRelation = {
    type: type,
    recordId: recordId,
    drawingNo: drawingNo,
    selectedPlanIds: []
  };

  // 设置标题和当前记录信息
  const typeNames = {
    'receive': '来料接收',
    'complete': '完工汇报',
    'transfer': '移交下道'
  };
  document.getElementById('manualRelationTitle').textContent = `人工关联计划 - ${typeNames[type]}`;
  document.getElementById('manualRelationRecord').textContent = `${recordId}`;
  document.getElementById('manualRelationDrawing').textContent = drawingNo;

  // 查找相同图号的生产订单
  const availablePlans = planOrderData.filter(p => p.drawingNo === drawingNo && p.status !== '已完成');

  // 渲染可关联的计划列表
  renderAvailablePlans(availablePlans);

  // 显示弹窗
  document.getElementById('manualRelationModal').style.display = 'flex';
}

function renderAvailablePlans(plans) {
  const tbody = document.getElementById('availablePlansTable');
  document.getElementById('manualRelationDrawingNo').textContent = currentManualRelation.drawingNo;

  tbody.innerHTML = plans.length > 0 ?
    plans.map(p => {
      const completionRate = ((p.completedQty / p.planQty) * 100).toFixed(1);
      const statusColor = p.status === '进行中' ? '#10b981' : p.status === '待开始' ? '#f59e0b' : '#6b7280';
      return `
      <tr>
        <td style="text-align: center;">
          <input type="checkbox" class="plan-checkbox" value="${p.id}" onchange="updateSelectedPlans()">
        </td>
        <td><strong>${p.id}</strong></td>
        <td>${p.erpOrderId}</td>
        <td>${p.drawingNo}</td>
        <td>${p.productName}</td>
        <td>${p.planQty}</td>
        <td>${p.completedQty}</td>
        <td><span style="color: ${statusColor}; font-weight: 600;">${p.status}</span></td>
      </tr>
    `}).join('') :
    '<tr><td colspan="8" style="text-align:center;color:#64748b;padding: 30px;">没有找到相同图号的可用生产订单</td></tr>';

  // 重置全选框
  document.getElementById('selectAllPlans').checked = false;
}

function toggleSelectAllPlans(checkbox) {
  const checkboxes = document.querySelectorAll('.plan-checkbox');
  checkboxes.forEach(cb => cb.checked = checkbox.checked);
  updateSelectedPlans();
}

function updateSelectedPlans() {
  const checkboxes = document.querySelectorAll('.plan-checkbox:checked');
  currentManualRelation.selectedPlanIds = Array.from(checkboxes).map(cb => cb.value);
}

function confirmManualRelation() {
  if (currentManualRelation.selectedPlanIds.length === 0) {
    alert('请至少选择一个生产订单进行关联');
    return;
  }

  // 获取相关数据
  let recordData, reportId, qty, scrapQty, qualifiedQty, process;

  switch (currentManualRelation.type) {
    case 'receive':
      // 来料接收
      recordData = receiveData.find(r => r.id === currentManualRelation.recordId);
      qty = recordData.qty;
      scrapQty = 0;
      qualifiedQty = recordData.acceptQty || qty;
      process = '来料接收';
      break;
    case 'complete':
      // 完工汇报
      recordData = reportRecordData.find(r => r.id === currentManualRelation.recordId);
      reportId = currentManualRelation.recordId;
      qty = recordData.reportQty;
      scrapQty = recordData.scrapQty || 0;
      qualifiedQty = recordData.qualifiedQty;
      process = recordData.process;
      break;
    case 'transfer':
      // 移交下道
      recordData = transferData.find(r => r.id === currentManualRelation.recordId);
      qty = recordData.qty;
      scrapQty = 0;
      qualifiedQty = qty;
      process = recordData.toProcess;
      break;
  }

  // 如果是完工汇报，使用原报工ID；否则创建新的报工记录
  if (!reportId) {
    reportId = `RP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

    // 创建新的报工记录
    reportRecordData.push({
      id: reportId,
      drawingNo: currentManualRelation.drawingNo,
      process: process,
      reportQty: qty,
      scrapQty: scrapQty,
      qualifiedQty: qualifiedQty,
      operator: currentManualRelation.type === 'receive' ? recordData.operator :
                 currentManualRelation.type === 'transfer' ? recordData.fromOp : recordData.operator,
      workTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      equipment: currentManualRelation.type === 'complete' ? recordData.equipment : '手动关联',
      batchNo: `BATCH-${Date.now()}`
    });
  }

  // 创建中间子表记录（按计划数量比例分配）
  const totalPlanQty = currentManualRelation.selectedPlanIds.reduce((sum, planId) => {
    const plan = planOrderData.find(p => p.id === planId);
    return sum + (plan ? plan.planQty : 0);
  }, 0);

  currentManualRelation.selectedPlanIds.forEach(planId => {
    const plan = planOrderData.find(p => p.id === planId);
    if (!plan) return;

    const ratio = plan.planQty / totalPlanQty;
    const allocatedQty = Math.floor(qty * ratio);
    const allocatedScrap = Math.floor(scrapQty * ratio);
    const allocatedQualified = Math.floor(qualifiedQty * ratio);

    const detailId = `PRD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

    planReportDetailData.push({
      id: detailId,
      planOrderId: planId,
      reportId: reportId,
      drawingNo: currentManualRelation.drawingNo,
      process: process,
      qty: allocatedQty,
      scrapQty: allocatedScrap,
      qualifiedQty: allocatedQualified,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
  });

  // 更新计划的完成数量
  currentManualRelation.selectedPlanIds.forEach(planId => {
    const plan = planOrderData.find(p => p.id === planId);
    if (plan) {
      plan.completedQty += qualifiedQty;
      if (plan.completedQty >= plan.planQty) {
        plan.status = '已完成';
      }
    }
  });

  // 刷新相关表格
  if (currentManualRelation.type === 'complete') {
    renderCompleteTableNew(reportRecordData);
  } else if (currentManualRelation.type === 'receive') {
    renderReceiveModuleTable(receiveData);
  } else if (currentManualRelation.type === 'transfer') {
    renderTransferTable(transferData);
  }

  // 关闭弹窗并提示
  closeManualRelationModal();
  showToast(`成功关联到 ${currentManualRelation.selectedPlanIds.length} 个生产订单`);
}

function closeManualRelationModal() {
  document.getElementById('manualRelationModal').style.display = 'none';
  document.getElementById('quantityInfo').style.display = 'none';
  currentManualRelation = { type: '', recordId: '', drawingNo: '', selectedPlanIds: [], transferQty: 0 };
}

function showRelatedReports(type, recordId, drawingNo) {
  if (type !== 'transfer') {
    showRelatedPlans(type, recordId, drawingNo);
    return;
  }

  currentManualRelation = {
    type: type,
    recordId: recordId,
    drawingNo: drawingNo,
    selectedReportIds: [],
    transferQty: 0
  };

  // 设置标题和当前记录信息
  document.getElementById('manualRelationTitle').textContent = `关联完工汇报 - 移交下道`;
  document.getElementById('relationListTitle').textContent = `可关联的完工汇报（相同图号和工序）`;
  document.getElementById('manualRelationRecord').textContent = `${recordId}`;
  document.getElementById('manualRelationDrawingNo').textContent = drawingNo;

  // 获取移交记录
  const transferRecord = transferData.find(t => t.id === recordId);
  currentManualRelation.transferQty = transferRecord.qty;

  // 查找相同图号和工序的完工汇报
  const availableReports = reportRecordData.filter(r =>
    r.drawingNo === drawingNo && r.process === transferRecord.fromProcess
  );

  // 渲染可关联的完工汇报列表
  renderAvailableReports(availableReports);

  // 显示数量校验信息
  document.getElementById('quantityInfo').style.display = 'block';
  updateQuantityInfo();

  // 显示弹窗
  document.getElementById('manualRelationModal').style.display = 'flex';
}

function renderAvailableReports(reports) {
  const tbody = document.getElementById('availablePlansTable');

  // 更新表头
  const thead = tbody.closest('table').querySelector('thead');
  thead.innerHTML = `
    <tr>
      <th style="width: 50px;">
        <input type="checkbox" id="selectAllPlans" onchange="toggleSelectAllReports(this)">
      </th>
      <th>报工号</th>
      <th>图号</th>
      <th>工序</th>
      <th>报工数量</th>
      <th>合格数量</th>
      <th>操作员</th>
      <th>报工时间</th>
    </tr>
  `;

  tbody.innerHTML = reports.length > 0 ?
    reports.map(r => `
      <tr>
        <td style="text-align: center;">
          <input type="checkbox" class="report-checkbox" value="${r.id}" onchange="updateSelectedReports()">
        </td>
        <td><strong>${r.id}</strong></td>
        <td>${r.drawingNo}</td>
        <td>${r.process}</td>
        <td>${r.reportQty}</td>
        <td>${r.qualifiedQty}</td>
        <td>${r.operator}</td>
        <td>${r.workTime}</td>
      </tr>
    `).join('') :
    '<tr><td colspan="8" style="text-align:center;color:#64748b;padding: 30px;">没有找到相同图号和工序的完工汇报记录</td></tr>';

  // 重置全选框
  document.getElementById('selectAllPlans').checked = false;
}

function toggleSelectAllReports(checkbox) {
  const checkboxes = document.querySelectorAll('.report-checkbox');
  checkboxes.forEach(cb => cb.checked = checkbox.checked);
  updateSelectedReports();
}

function updateSelectedReports() {
  const checkboxes = document.querySelectorAll('.report-checkbox:checked');
  currentManualRelation.selectedReportIds = Array.from(checkboxes).map(cb => cb.value);
  updateQuantityInfo();
}

function updateQuantityInfo() {
  if (currentManualRelation.type !== 'transfer') {
    document.getElementById('quantityInfo').style.display = 'none';
    return;
  }

  const selectedReports = currentManualRelation.selectedReportIds.map(id =>
    reportRecordData.find(r => r.id === id)
  ).filter(r => r);

  const selectedTotalQty = selectedReports.reduce((sum, r) => sum + r.qualifiedQty, 0);

  let detailHtml = `
    移交数量: <strong>${currentManualRelation.transferQty}</strong> | 
    已选合格数量: <strong>${selectedTotalQty}</strong><br>
    <span style="color: #64748b; font-size: 12px;">
      系统将按比例从完工汇报中分配数量到移交记录
    </span>
  `;

  document.getElementById('quantityDetail').innerHTML = detailHtml;
  document.getElementById('quantityInfo').style.backgroundColor = '#f0f9ff';
  document.getElementById('quantityInfo').style.borderLeftColor = '#0ea5e9';
  document.getElementById('quantityInfo').querySelector('div').style.color = '#0369a1';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("planTableBody")) renderPlanTable();
});
