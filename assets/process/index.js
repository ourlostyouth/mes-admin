// ========== Process 页面函数 ==========

function renderProcessTable(data = processData) {
  const tbody = document.getElementById('processTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td><span class="status-badge" style="background:#dbeafe;color:#2563eb;font-weight:500">${item.code}</span></td>
      <td>${item.workshop}</td>
      <td>${item.category}</td>
      <td>${item.standardTime}</td>
      <td>${item.equipment}</td>
      <td>${item.sortOrder}</td>
      <td>
        <label class="toggle-switch">
          <input type="checkbox" ${item.status === '启用' ? 'checked' : ''} onchange="toggleProcessStatus('${item.id}', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td>
        <a class="action-link" onclick="editProcess('${item.id}')">编辑</a>
        <a class="action-link" style="color:#ef4444;margin-left:12px;" onclick="confirmDeleteProcess('${item.id}','${item.name}')">删除</a>
      </td>
    </tr>
  `).join('');

  // 更新统计数字
  document.getElementById('processTotal').textContent = processData.length;
  document.getElementById('processActive').textContent = processData.filter(d => d.status === '启用').length;
  document.getElementById('processInactive').textContent = processData.filter(d => d.status === '停用').length;
}

function openProcessModal() {
  currentEditProcessId = null;
  document.getElementById('processModalTitle').textContent = '新增工序';
  document.getElementById('procName').value = '';
  document.getElementById('procCode').value = '';
  document.getElementById('procWorkshop').value = '';
  document.getElementById('procCategory').value = '';
  document.getElementById('procStandardTime').value = '';
  document.getElementById('procEquipment').value = '';
  document.getElementById('procSortOrder').value = processData.length + 1;
  document.getElementById('procStatus').value = '启用';
  document.getElementById('processModal').classList.add('show');
}

function editProcess(id) {
  currentEditProcessId = id;
  const item = processData.find(d => d.id === id);
  if (!item) return;

  document.getElementById('processModalTitle').textContent = '编辑工序';
  document.getElementById('procName').value = item.name;
  document.getElementById('procCode').value = item.code;
  document.getElementById('procWorkshop').value = item.workshop;
  document.getElementById('procCategory').value = item.category;
  document.getElementById('procStandardTime').value = item.standardTime;
  document.getElementById('procEquipment').value = item.equipment;
  document.getElementById('procSortOrder').value = item.sortOrder;
  document.getElementById('procStatus').value = item.status;
  document.getElementById('processModal').classList.add('show');
}

function closeProcessModal() {
  document.getElementById('processModal').classList.remove('show');
  currentEditProcessId = null;
}

function saveProcess() {
  const name = document.getElementById('procName').value.trim();
  const code = document.getElementById('procCode').value.trim();
  const workshop = document.getElementById('procWorkshop').value.trim();
  const category = document.getElementById('procCategory').value.trim();
  const standardTime = parseInt(document.getElementById('procStandardTime').value) || 0;
  const equipment = document.getElementById('procEquipment').value.trim();
  const sortOrder = parseInt(document.getElementById('procSortOrder').value) || 0;
  const status = document.getElementById('procStatus').value;

  if (!name || !code) {
    showToast('请填写工序名称和工序代码');
    return;
  }

  if (currentEditProcessId) {
    // 编辑
    const item = processData.find(d => d.id === currentEditProcessId);
    if (item) {
      item.name = name;
      item.code = code;
      item.workshop = workshop;
      item.category = category;
      item.standardTime = standardTime;
      item.equipment = equipment;
      item.sortOrder = sortOrder;
      item.status = status;
      showToast('工序更新成功');
    }
  } else {
    // 新增
    const newId = 'PROC-' + String(processData.length + 1).padStart(3, '0');
    const newItem = {
      id: newId,
      name,
      code,
      workshop,
      category,
      standardTime,
      equipment,
      sortOrder,
      status
    };
    processData.push(newItem);
    showToast('工序添加成功');
  }

  renderProcessTable();
  closeProcessModal();
}

function toggleProcessStatus(id, checked) {
  const item = processData.find(d => d.id === id);
  if (item) {
    item.status = checked ? '启用' : '停用';
    renderProcessTable();
    showToast(checked ? '工序已启用' : '工序已停用');
  }
}

function confirmDeleteProcess(id, name) {
  currentDeleteType = 'process';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除工序 "${name}" 吗？此操作不可恢复`;
  document.getElementById('deleteModal').classList.add('show');
}

function deleteProcess(id) {
  processData = processData.filter(d => d.id !== id);
  renderProcessTable();
  showToast('工序删除成功');
}

function searchProcess() {
  const keyword = document.getElementById('procSearchInput').value.toLowerCase();
  const filtered = processData.filter(d =>
    d.name.toLowerCase().includes(keyword) ||
    d.code.toLowerCase().includes(keyword) ||
    d.workshop.toLowerCase().includes(keyword) ||
    d.category.toLowerCase().includes(keyword)
  );
  renderProcessTable(filtered);
}

// 关闭删除模态框
function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.remove('show');
  }
  currentDeleteType = null;
  currentDeleteId = null;
}

// 确认删除（通用）
function confirmDelete() {
  if (!currentDeleteType || !currentDeleteId) {
    closeDeleteModal();
    return;
  }

  if (currentDeleteType === 'process') {
    processData = processData.filter(d => d.id !== currentDeleteId);
    renderProcessTable();
    showToast('工序删除成功');
  }

  closeDeleteModal();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("processTableBody")) renderProcessTable();
});
