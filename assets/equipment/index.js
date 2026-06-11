// ========== Equipment 设备管理页面函数 ==========

// 渲染设备表格
function renderEquipmentTable(data = equipmentData) {
  const tbody = document.getElementById('equipmentTableBody');
  if (!tbody) return;

  const statusMap = { '正常': 'normal', '需维护': 'warning', '故障': 'error' };

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.model}</td>
      <td>${item.process}</td>
      <td><span class="status-badge ${statusMap[item.status] || 'normal'}">${item.status}</span></td>
      <td>
        <a class="action-link" onclick="editEquipment('${item.id}')">编辑</a>
        <a class="action-link" style="color:#ef4444;margin-left:12px;" onclick="confirmDeleteEquipment('${item.id}','${item.name}')">删除</a>
      </td>
    </tr>
  `).join('');

  // 更新统计数字
  const eqTotalCount = document.getElementById('eqTotalCount');
  const eqNormalCount = document.getElementById('eqNormalCount');
  const eqMaintainCount = document.getElementById('eqMaintainCount');
  const eqFaultCount = document.getElementById('eqFaultCount');
  
  if (eqTotalCount) eqTotalCount.textContent = equipmentData.length;
  if (eqNormalCount) eqNormalCount.textContent = equipmentData.filter(d => d.status === '正常').length;
  if (eqMaintainCount) eqMaintainCount.textContent = equipmentData.filter(d => d.status === '需维护').length;
  if (eqFaultCount) eqFaultCount.textContent = equipmentData.filter(d => d.status === '故障').length;
}

// 打开新增设备模态框
function openEquipmentModal() {
  currentEditEquipmentId = null;
  const title = document.getElementById('equipmentModalTitle');
  const name = document.getElementById('eqName');
  const model = document.getElementById('eqModel');
  const process = document.getElementById('eqProcess');
  const status = document.getElementById('eqStatus');
  const modal = document.getElementById('equipmentModal');
  
  if (title) title.textContent = '新增设备';
  if (name) name.value = '';
  if (model) model.value = '';
  if (process) process.value = '';
  if (status) status.value = '正常';
  if (modal) modal.classList.add('show');
}

// 编辑设备
function editEquipment(id) {
  currentEditEquipmentId = id;
  const item = equipmentData.find(d => d.id === id);
  if (!item) return;
  
  const title = document.getElementById('equipmentModalTitle');
  const name = document.getElementById('eqName');
  const model = document.getElementById('eqModel');
  const process = document.getElementById('eqProcess');
  const status = document.getElementById('eqStatus');
  const modal = document.getElementById('equipmentModal');
  
  if (title) title.textContent = '编辑设备';
  if (name) name.value = item.name;
  if (model) model.value = item.model;
  if (process) process.value = item.process;
  if (status) status.value = item.status;
  if (modal) modal.classList.add('show');
}

// 关闭设备模态框
function closeEquipmentModal() {
  const modal = document.getElementById('equipmentModal');
  if (modal) modal.classList.remove('show');
  currentEditEquipmentId = null;
}

// 保存设备
function saveEquipment() {
  const name = document.getElementById('eqName')?.value.trim();
  const model = document.getElementById('eqModel')?.value.trim();
  const process = document.getElementById('eqProcess')?.value.trim();
  const status = document.getElementById('eqStatus')?.value;

  if (!name) { showToast('请输入设备名称'); return; }
  if (!model) { showToast('请输入设备型号'); return; }

  if (currentEditEquipmentId) {
    const index = equipmentData.findIndex(d => d.id === currentEditEquipmentId);
    if (index !== -1) {
      equipmentData[index] = { ...equipmentData[index], name, model, process, status };
      showToast('设备更新成功');
    }
  } else {
    const newId = 'EQ-' + String(equipmentData.length + 1).padStart(3, '0');
    equipmentData.push({ id: newId, name, model, process, status });
    showToast('设备新增成功');
  }

  renderEquipmentTable();
  closeEquipmentModal();
}

// 确认删除设备
function confirmDeleteEquipment(id, name) {
  currentDeleteType = 'equipment';
  currentDeleteId = id;
  const hint = document.getElementById('deleteConfirmHint');
  const modal = document.getElementById('deleteModal');
  
  if (hint) hint.textContent = `确定要删除设备 "${name}" 吗？此操作不可恢复`;
  if (modal) modal.classList.add('show');
}

// 搜索设备
function searchEquipment() {
  const keyword = document.getElementById('eqSearchInput')?.value.toLowerCase();
  if (!keyword) {
    renderEquipmentTable();
    return;
  }
  
  const filtered = equipmentData.filter(d =>
    d.name.toLowerCase().includes(keyword) ||
    d.model.toLowerCase().includes(keyword) ||
    d.process.toLowerCase().includes(keyword)
  );
  renderEquipmentTable(filtered);
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

  if (currentDeleteType === 'equipment') {
    equipmentData = equipmentData.filter(d => d.id !== currentDeleteId);
    renderEquipmentTable();
    showToast('设备删除成功');
  }

  closeDeleteModal();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('equipmentTableBody')) {
    renderEquipmentTable();
  }
});
