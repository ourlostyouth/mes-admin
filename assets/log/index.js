// ========== Log 页面函数 ==========

function renderReportLogTable(data = reportLogData) {
  const moduleFilter = document.getElementById('logModuleFilter')?.value || '';

  let filtered = data;

  if (moduleFilter) {
    filtered = filtered.filter(d => d.documentType === moduleFilter);
  }

  const tbody = document.getElementById('logTableBody');
  if (!tbody) return;

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.user}</td>
      <td><span class="status-badge ${getLogOperationTypeClass(item.operationType)}">${item.operationType}</span></td>
      <td>${item.documentType}</td>
      <td><strong>${item.documentId}</strong></td>
      <td>${item.content}</td>
      <td>${item.ip}</td>
      <td>${item.time}</td>
      <td><span class="status-badge ${item.status === '成功' ? 'normal' : 'error'}">${item.status}</span></td>
    </tr>
  `).join('');

  // 更新统计数据
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = reportLogData.filter(log => log.time.startsWith(today));
  document.getElementById('reportModifyTodayCount').textContent = todayLogs.length;
  document.getElementById('reportModifyWeekCount').textContent = reportLogData.length;
  document.getElementById('reportModifyTotalCount').textContent = reportLogData.length;
}

function getLogOperationTypeClass(type) {
  const typeClassMap = {
    '新增': 'normal',
    '编辑': 'warning',
    '移交': 'blue'
  };
  return typeClassMap[type] || 'normal';
}

function searchReportLog() {
  const kw = document.getElementById('logSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderReportLogTable();
    return;
  }
  const filtered = reportLogData.filter(d =>
    d.id.toLowerCase().includes(kw) ||
    d.user.toLowerCase().includes(kw) ||
    d.documentId.toLowerCase().includes(kw)
  );
  renderReportLogTable(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("logTableBody")) renderReportLogTable();
});
