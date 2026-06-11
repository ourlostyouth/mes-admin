// ========== Report-complete 页面函数 ==========

function renderCompleteTable(data = reportRecordData) {
  renderCompleteTableNew(data);

  // 更新统计(基于关联的计划订单状态)
  const planInProgress = planOrderData.filter(p => p.status === '进行中').length;
  const planCompleted = planOrderData.filter(p => p.status === '已完成').length;
  const planTotal = planOrderData.length;
  const planIssues = reportRecordData.filter(r => r.scrapQty > 10).length;

  document.getElementById('completeInProgressCount').textContent = planInProgress;
  document.getElementById('completeDoneCount').textContent = planCompleted;
  document.getElementById('completeIssueCount').textContent = planIssues;
  document.getElementById('completeTotalCount').textContent = planTotal;
}

function renderCompleteTableNew(data = reportRecordData) {
  const tbody = document.getElementById('completeTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(r => {
    // 查找该报工关联的生产订单
    const details = planReportDetailData.filter(d => d.reportId === r.id);
    const relatedPlans = [...new Set(details.map(d => d.planOrderId))];

    return `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${r.drawingNo}</td>
      <td>${r.process}</td>
      <td>${r.reportQty}</td>
      <td style="color:${r.scrapQty>0?'#991b1b':'#1a1a1a'}">${r.scrapQty}</td>
      <td>${r.qualifiedQty}</td>
      <td>${relatedPlans.length > 0 ? relatedPlans.join(', ') : '未关联'}</td>
      <td>${r.operator}</td>
      <td>${r.equipment}</td>
      <td>${r.workTime}</td>
      <td>
        <a class="action-link" onclick="viewReportPlanRelation('${r.id}')">查看计划</a>
      </td>
    </tr>
  `}).join('');
}

function searchCompleteData() {
  const kw = document.getElementById('completeSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderCompleteTableNew(reportRecordData);
    return;
  }
  const filtered = reportRecordData.filter(d =>
    d.id.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw) ||
    d.process.toLowerCase().includes(kw) ||
    d.operator.toLowerCase().includes(kw)
  );
  renderCompleteTableNew(filtered);
}

// 查看报工关联的计划
function viewReportPlanRelation(reportId) {
  const report = reportRecordData.find(r => r.id === reportId);
  if (!report) return;

  // 查找该报工关联的中间子表数据
  const details = planReportDetailData.filter(d => d.reportId === reportId);

  // 查找关联的生产订单
  const relatedPlanIds = [...new Set(details.map(d => d.planOrderId))];
  const relatedPlans = planOrderData.filter(p => relatedPlanIds.includes(p.id));

  // 如果只关联一个计划,直接显示该计划的关联关系
  if (relatedPlans.length === 1) {
    viewPlanReportRelation(relatedPlans[0].id);
  } else {
    // 如果关联多个计划,提示用户选择
    alert(`该报工关联了 ${relatedPlans.length} 个生产订单:\n${relatedPlans.map(p => p.id).join('\n')}`);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("completeTableBody")) renderCompleteTable();
});
