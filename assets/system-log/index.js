// ========== System-log 页面函数 ==========

function renderSystemLogTable(data = systemLogData) {
  const moduleFilter = document.getElementById('systemLogModuleFilter')?.value || '';
  const typeFilter = document.getElementById('systemLogTypeFilter')?.value || '';

  let filtered = data;

  if (moduleFilter) {
    filtered = filtered.filter(d => d.module === moduleFilter);
  }
  if (typeFilter) {
    filtered = filtered.filter(d => d.type === typeFilter);
  }

  const tbody = document.getElementById('systemLogTableBody');
  if (!tbody) return;

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.user}</td>
      <td>${item.module}</td>
      <td><span class="status-badge ${getLogTypeClass(item.type)}">${item.type}</span></td>
      <td>${item.content}</td>
      <td>${item.ip}</td>
      <td>${item.time}</td>
      <td><span class="status-badge ${item.status === '成功' ? 'normal' : 'error'}">${item.status}</span></td>
    </tr>
  `).join('');
}

function getLogTypeClass(type) {
  const map = { '新增': 'normal', '编辑': 'warning', '删除': 'error', '查询': 'normal' };
  return map[type] || 'normal';
}

function searchSystemLog() {
  const keyword = document.getElementById('systemLogSearchInput').value.toLowerCase();
  const filtered = systemLogData.filter(item =>
    item.user.toLowerCase().includes(keyword) ||
    item.content.toLowerCase().includes(keyword) ||
    item.id.toLowerCase().includes(keyword)
  );
  renderSystemLogTable(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("systemLogTableBody")) renderSystemLogTable();
});
