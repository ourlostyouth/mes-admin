// ========== Report-transfer 页面函数 ==========

function renderTransferTable(data = transferData) {
  const tbody = document.getElementById('transferTableBody');
  if (!tbody) return;
  const statusMap = { 'transferred': 'normal', 'waiting': 'warning', 'rejected': 'error' };

  // 查找每个移交记录关联的完工汇报
  const tableData = data.map(r => {
    const relations = transferReportRelationData.filter(tr => tr.transferId === r.id);
    // 显示每个关联报工及其分配的数量
    const reportDetail = relations.map(tr => {
      const report = reportRecordData.find(rep => rep.id === tr.reportId);
      return report ? `${tr.reportId}(${tr.qty})` : tr.reportId;
    }).join(', ');
    return { ...r, relatedReports: reportDetail };
  });

  tbody.innerHTML = tableData.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${r.drawingNo}</td>
      <td>${r.fromProcess}</td>
      <td>${r.toProcess}</td>
      <td>${r.qty}</td>
      <td><span class="status-badge ${statusMap[r.status]}">${r.statusText}</span></td>
      <td>${r.fromOp}</td>
      <td>${r.toOp}</td>
      <td>${r.time}</td>
      <td>${r.relatedReports}</td>
    </tr>
  `).join('');

  // 更新统计
  document.getElementById('transferWaitingCount').textContent = transferData.filter(d => d.status === 'waiting').length;
  document.getElementById('transferDoneCount').textContent = transferData.filter(d => d.status === 'transferred').length;
  document.getElementById('transferRejectCount').textContent = transferData.filter(d => d.status === 'rejected').length;
  document.getElementById('transferTotalCount').textContent = transferData.length;
}

function searchTransferData() {
  const kw = document.getElementById('transferSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderTransferTable(transferData);
    return;
  }
  const filtered = transferData.filter(d =>
    d.id.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw)
  );
  renderTransferTable(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("transferTableBody")) renderTransferTable();
});
