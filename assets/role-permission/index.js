// ========== Role-permission 页面函数 ==========

function getSelectedPermissions() {
  const container = document.getElementById('permConfigTree');
  if (!container) return [];
  const checkedInputs = container.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
  return Array.from(checkedInputs).map(cb => cb.value);
}

function openRolePermConfigModal(roleId) {
  currentPermConfigRoleId = roleId;
  const role = roleData.find(r => r.id === roleId);
  if (!role) return;

  document.getElementById('rolePermConfigTitle').textContent = '配置权限 - ' + role.name;
  document.getElementById('rolePermConfigRoleName').textContent = role.name;
  document.getElementById('rolePermConfigRoleType').textContent = role.type + ' · ' + (role.status === '启用' ? '已启用' : '已停用');

  renderPermConfigTree(role.permissions || []);
  document.getElementById('rolePermConfigModal').classList.add('show');
}

function closeRolePermConfigModal() {
  document.getElementById('rolePermConfigModal').classList.remove('show');
  currentPermConfigRoleId = null;
}

function renderPermConfigTree(selectedPerms) {
  const container = document.getElementById('permConfigTree');
  if (!container) return;

  const opLabels = { add: '增', edit: '改', delete: '删', view: '查' };
  const dataScopes = [
    { value: 'personal', label: '个人' },
    { value: 'department', label: '所属部门' },
    { value: 'departmentAndSub', label: '所属部门和下属部门' },
    { value: 'company', label: '全公司' }
  ];

  container.innerHTML = '<table class="perm-config-table">' +
    '<thead><tr>' +
      '<th style="width:60px;">序列号</th>' +
      '<th style="width:140px;">所属模块</th>' +
      '<th style="width:200px;">操作权限</th>' +
      '<th>数据权限</th>' +
    '</tr></thead>' +
    '<tbody>' +
    menuPermissions.map((m, idx) => {
      const opHtml = m.operations.map(op => {
        const permId = m.id + '-' + op;
        const checked = selectedPerms.includes(permId) ? 'checked' : '';
        return '<label style="margin-right:12px;cursor:pointer;"><input type="checkbox" value="' + permId + '" ' + checked + '> ' + opLabels[op] + '</label>';
      }).join('');

      const currentDataScope = dataScopes.find(ds => selectedPerms.includes(m.id + '-data-' + ds.value));
      const dataHtml = dataScopes.map(ds => {
        const permId = m.id + '-data-' + ds.value;
        const checked = currentDataScope && currentDataScope.value === ds.value ? 'checked' : '';
        return '<label style="margin-right:12px;cursor:pointer;"><input type="radio" name="dataScope_' + m.id + '" value="' + permId + '" ' + checked + '> ' + ds.label + '</label>';
      }).join('');

      return '<tr><td>' + (idx + 1) + '</td><td><strong>' + m.name + '</strong></td><td>' + opHtml + '</td><td>' + dataHtml + '</td></tr>';
    }).join('') +
    '</tbody></table>';
}

function saveRolePermConfig() {
  if (!currentPermConfigRoleId) return;

  const permissions = getSelectedPermissions();
  const index = roleData.findIndex(r => r.id === currentPermConfigRoleId);
  if (index !== -1) {
    roleData[index].permissions = permissions;
    showToast('权限配置保存成功');
  }

  closeRolePermConfigModal();
  renderRoleTable();
}

function openRoleModal() {
  currentEditId = null;
  document.getElementById('roleModalTitle').textContent = '新增角色';
  document.getElementById('roleName').value = '';
  document.getElementById('roleType').value = '';
  document.getElementById('roleStatus').value = '启用';
  document.getElementById('roleModal').classList.add('show');
}

function editRole(id) {
  currentEditId = id;
  const item = roleData.find(d => d.id === id);
  if (!item) return;

  document.getElementById('roleModalTitle').textContent = '编辑角色';
  document.getElementById('roleName').value = item.name;
  document.getElementById('roleType').value = item.type;
  document.getElementById('roleStatus').value = item.status;
  document.getElementById('roleModal').classList.add('show');
}

function closeRoleModal() {
  document.getElementById('roleModal').classList.remove('show');
  currentEditId = null;
}

function saveRole() {
  const name = document.getElementById('roleName').value.trim();
  const type = document.getElementById('roleType').value;
  const status = document.getElementById('roleStatus').value;

  if (!name) {
    showToast('请输入角色名称');
    return;
  }
  if (!type) {
    showToast('请选择角色类型');
    return;
  }

  if (currentEditId) {
    // 编辑
    const index = roleData.findIndex(d => d.id === currentEditId);
    if (index !== -1) {
      roleData[index] = {
        ...roleData[index],
        name, type, status
      };
      showToast('角色更新成功');
    }
  } else {
    // 新增
    const newId = 'ROLE-' + String(roleData.length + 1).padStart(3, '0');
    const newRole = {
      id: newId,
      name,
      type,
      users: 0,
      permissions: [],
      createTime: new Date().toISOString().split('T')[0],
      status
    };
    roleData.push(newRole);
    showToast('角色新增成功');
  }

  renderRoleTable();
  closeRoleModal();
}

function renderRoleTable(data = roleData) {
  const tbody = document.getElementById('roleTableBody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8;">暂无数据</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="status-badge ${getRoleTypeClass(item.type)}">${item.type}</span></td>
      <td>${item.users}</td>
      <td>${item.createTime}</td>
      <td><span class="status-badge ${item.status === '启用' ? 'normal' : 'warning'}">${item.status}</span></td>
      <td>
        <div class="table-actions-col">
          <a class="action-link" onclick="editRole('${item.id}')">编辑</a>
          <a class="action-link" onclick="openRolePermConfigModal('${item.id}')" style="color:#2563eb;">权限</a>
          <a class="action-link danger" onclick="confirmDeleteRole('${item.id}','${item.name}')">删除</a>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchRole() {
  const keyword = document.getElementById('roleSearchInput').value.toLowerCase();
  const filtered = roleData.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.id.toLowerCase().includes(keyword)
  );
  renderRoleTable(filtered);
}

function getRoleTypeClass(type) {
  const map = { '系统角色': 'error', '业务角色': 'normal', '临时角色': 'warning' };
  return map[type] || 'normal';
}

function confirmDeleteRole(id, name) {
  currentDeleteType = 'role';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除 "${name}" 吗？此操作不可恢复`;
  document.getElementById('deleteModal').classList.add('show');
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

  if (currentDeleteType === 'role') {
    roleData = roleData.filter(d => d.id !== currentDeleteId);
    renderRoleTable();
    showToast('角色删除成功');
  }

  closeDeleteModal();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("roleTableBody")) renderRoleTable();
});
