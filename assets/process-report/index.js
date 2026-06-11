// ========== Process-report 页面函数 ==========

function renderProcessReportTable(data = processReportData) {
  const tbody = document.getElementById('processReportTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(item => {
    const processNames = ['成型', '修理', '生检', '上釉', '装车', '瓷检', '安装', '拉力', '电检', '包装'];
    const completionRate = ((item.totalQualified / item.planQuantity) * 100).toFixed(1);
    const lossRate = ((item.totalLoss / item.planQuantity) * 100).toFixed(1);

    let processQualifiedCells = processNames.map(name => {
      const qualified = item.processes[name]?.qualified || 0;
      const bgColor = qualified > 0 ? '#dcfce7' : '#f1f5f9';
      const textColor = qualified > 0 ? '#16a34a' : '#94a3b8';
      return `<td style="background:${bgColor};color:${textColor};font-weight:600;">${qualified}</td>`;
    }).join('');

    let processLossCells = processNames.map(name => {
      const loss = item.processes[name]?.loss || 0;
      const bgColor = loss > 0 ? '#fee2e2' : '#f1f5f9';
      const textColor = loss > 0 ? '#dc2626' : '#94a3b8';
      return `<td style="background:${bgColor};color:${textColor};font-weight:600;">${loss}</td>`;
    }).join('');

    return `
      <tr>
        <td style="background:#eff6ff;">${item.orderId}</td>
        <td><strong>${item.drawingNo}</strong></td>
        <td>${item.productName}</td>
        <td>${item.planQuantity}</td>
        <td style="background:#dcfce7;color:#16a34a;font-weight:700;">${item.totalQualified}</td>
        <td style="background:#fee2e2;color:#dc2626;font-weight:700;">${item.totalLoss}</td>
        ${processQualifiedCells}
        ${processLossCells}
        <td>
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="display:flex;align-items:center;gap:8px;width:100%;">
              <div style="flex:1;height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
                <div style="width:${Math.min(completionRate, 100)}%;height:100%;background:${completionRate >= 95 ? '#22c55e' : completionRate >= 80 ? '#f97316' : '#ef4444'};transition:width 0.3s;"></div>
              </div>
              <span style="font-weight:700;font-size:12px;color:${completionRate >= 95 ? '#22c55e' : completionRate >= 80 ? '#f97316' : '#ef4444'};min-width:45px;">${completionRate}%</span>
            </div>
            <span style="font-size:11px;color:#94a3b8;">损耗率: ${lossRate}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // 更新统计
  document.getElementById('processReportTotalOrders').textContent = data.length;
  document.getElementById('processReportTotalQuantity').textContent = data.reduce((sum, item) => sum + item.planQuantity, 0).toLocaleString();
  document.getElementById('processReportCompleteQuantity').textContent = data.reduce((sum, item) => sum + item.totalQualified, 0).toLocaleString();
  document.getElementById('processReportLossQuantity').textContent = data.reduce((sum, item) => sum + item.totalLoss, 0).toLocaleString();
}

function searchProcessReport() {
  const kw = document.getElementById('processReportSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderProcessReportTable();
    return;
  }
  const filtered = processReportData.filter(d =>
    d.orderId.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw) ||
    d.productName.toLowerCase().includes(kw)
  );
  renderProcessReportTable(filtered);
}

function exportProcessReport() {
  showToast('报表导出功能开发中...');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("processReportTableBody")) renderProcessReportTable();
});
