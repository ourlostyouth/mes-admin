// ========== User-management 页面函数 ==========

function renderUserOrgTree() {
  const container = document.getElementById('userOrgTreeContainer');
  if (!container) return;

  const rootDept = organizationData.find(d => d.parent === '-');
  if (!rootDept) { renderUserTable(); return; }

  function buildTreeNode(dept, level) {
    const children = organizationData.filter(d => d.parent === dept.name);
    const allDescendants = getAllDescendantDeptNames(dept.name);
    const empCount = employeeData.filter(e => allDescendants.includes(e.department)).length;
    const isRoot = level === 1;
    const hasChildren = children.length > 0;
    const indentStyle = `padding-left:${(level - 1) * 20}px;`;
    const iconClass = isRoot ? 'company' : (hasChildren ? 'department' : 'team');

    return `
    <div class="org-tree-node" style="${indentStyle}">
      <div class="org-tree-node-content" onclick="filterUsersByDept('${dept.id}', '${dept.name}')" data-user-dept="${dept.id}">
        ${hasChildren ? `<div class="tree-toggle" onclick="event.stopPropagation();toggleUserOrgNode(this, '${dept.id}')">
          <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#94a3b8;"><path d="M8 5l8 7-8 7z"/></svg>
        </div>` : `<div class="tree-toggle leaf"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#94a3b8;"><path d="M8 5l8 7-8 7z"/></svg></div>`}
        <div class="tree-icon ${iconClass}">
          ${isRoot ? `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`
          : hasChildren ? `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`
          : `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`}
        </div>
        <div class="tree-label">${dept.name}</div>
        <div class="tree-badge">${empCount}人</div>
      </div>
      ${hasChildren ? `<div class="org-tree-children" id="userOrgChildren_${dept.id}">${children.map(c => buildTreeNode(c, level + 1)).join('')}</div>` : ''}
    </div>`;
  }

  container.innerHTML = `
    <div class="org-tree">
      ${buildTreeNode(rootDept, 1)}
    </div>`;

  // 默认选中根节点（大连电瓷集团）
  filterUsersByDept(rootDept.id, rootDept.name);
}

function toggleUserOrgNode(el, deptId) {
  el.classList.toggle('expanded');
  const children = document.getElementById('userOrgChildren_' + deptId);
  if (children) children.style.display = children.style.display === 'none' ? 'block' : 'none';
}

function filterUsersByDept(deptId, deptName) {
  document.querySelectorAll('#userOrgTreeContainer .org-tree-node-content').forEach(el => el.classList.remove('active'));
  const selector = deptId ? `[data-user-dept="${deptId}"]` : '[data-user-dept="all"]';
  const target = document.querySelector('#userOrgTreeContainer ' + selector);
  if (target) target.classList.add('active');

  currentUserFilterDept = deptId;
  document.getElementById('userRightTitle').textContent = deptName || '全部用户';
  userPage.page = 1;
  renderUserTable();
}

function searchUserData() {
  userPage.page = 1;
  renderUserTable();
}

function resetUserSearch() {
  document.getElementById('userSearchName').value = '';
  document.getElementById('userSearchPhone').value = '';
  document.getElementById('userSearchStatus').value = '';
  userPage.page = 1;
  renderUserTable();
}

function renderUserTable() {
  const nameFilter = (document.getElementById('userSearchName')?.value || '').toLowerCase();
  const phoneFilter = (document.getElementById('userSearchPhone')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('userSearchStatus')?.value || '';

  let data = employeeData;

  if (currentUserFilterDept) {
    const selDept = organizationData.find(d => d.id === currentUserFilterDept);
    if (selDept) {
      const deptNames = getAllDescendantDeptNames(selDept.name);
      data = data.filter(e => deptNames.includes(e.department));
    }
  }

  if (nameFilter) data = data.filter(e => e.name.toLowerCase().includes(nameFilter));
  if (phoneFilter) data = data.filter(e => e.phone.includes(phoneFilter));
  if (statusFilter) data = data.filter(e => e.status === statusFilter);

  userPage.total = data.length;
  const start = (userPage.page - 1) * userPage.size;
  const pageData = data.slice(start, start + userPage.size);

  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:#94a3b8;">暂无数据</td></tr>';
  } else {
    tbody.innerHTML = pageData.map(e => {
      const statusClass = e.status === '在职' ? 'normal' : 'error';
      const nickName = e.nickname || e.name;
      const position = e.position || '-';
      const processes = (e.processes && e.processes.length > 0) ? e.processes.join('、') : '-';
      return `<tr>
        <td><strong>${e.name}</strong></td>
        <td>${nickName}</td>
        <td>${e.department}</td>
        <td>${position}</td>
        <td>${processes}</td>
        <td>${e.phone}</td>
        <td><span class="status-badge ${statusClass}">${e.status}</span></td>
        <td>${e.roles.map(rid => { const r = roleData.find(rd => rd.id === rid); return r ? `<span class="role-tag-inline ${r.type === '系统角色' ? 'admin' : r.type === '业务角色' ? 'manager' : 'guest'}">${r.name}</span>` : '' }).join(' ')}</td>
        <td>${e.joinDate}</td>
        <td>
          <div class="table-actions-col">
            <a class="action-link" onclick="viewUser('${e.id}')">查看</a>
            <a class="action-link" onclick="editUser('${e.id}')">编辑</a>
            <a class="action-link danger" onclick="deleteUser('${e.id}')">删除</a>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  renderPagination(userPage, 'userPageCtrl', 'userPageInfo', 'goUserPage');
}

function goUserPage(page, size) {
  if (size) userPage.size = parseInt(size);
  userPage.page = page;
  renderUserTable();
}

function viewUser(id) {
  const user = employeeData.find(e => e.id === id);
  if (!user) return;
  showToast('查看用户 ' + user.name + ' 详情 (ID: ' + id + ')');
}

function editUser(id) {
  currentEditUserId = id;
  const user = employeeData.find(e => e.id === id);
  if (!user) return;
  
  document.getElementById('userModalTitle').textContent = '编辑用户';
  document.getElementById('userName').value = user.name;
  // 兼容旧数据：nickname 是新字段，旧数据 nickname 在 position 里
  document.getElementById('userNick').value = user.nickname || user.position || '';
  document.getElementById('userPhone').value = user.phone;
  document.getElementById('userEmail').value = user.email || '';
  document.getElementById('userJoinDate').value = user.joinDate || '';
  document.getElementById('userStatus').value = user.status || '在职';
  
  populateUserDeptSelect();
  document.getElementById('userDept').value = user.department || '';
  onUserDeptChange();
  document.getElementById('userPosition').value = user.position || '';
  
  // 如果是生产部，渲染工序复选框并勾选
  if (user.department === '生产部') {
    renderUserProcessCheckboxes(user.processes || []);
  }
  
  renderUserRolesCheckboxes();
  if (user.roles) {
    user.roles.forEach(rid => {
      const cb = document.querySelector('#userRolesCheckboxes input[value="' + rid + '"]');
      if (cb) cb.checked = true;
    });
  }
  
  document.getElementById('userModal').classList.add('show');
}

function deleteUser(id) {
  const user = employeeData.find(e => e.id === id);
  if (!user) return;
  
  currentDeleteType = 'user';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除 "${user.name}" 吗？此操作不可恢复`;
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

  if (currentDeleteType === 'user') {
    const user = employeeData.find(e => e.id === currentDeleteId);
    employeeData = employeeData.filter(e => e.id !== currentDeleteId);
    renderUserTable();
    showToast(`用户 ${user.name} 已删除`);
  }

  closeDeleteModal();
}

// 打开用户模态框（新增）
function openUserModal() {
  currentEditUserId = null;
  document.getElementById('userModalTitle').textContent = '新增用户';
  document.getElementById('userName').value = '';
  document.getElementById('userNick').value = '';
  document.getElementById('userPhone').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userJoinDate').value = '';
  document.getElementById('userStatus').value = '在职';
  
  populateUserDeptSelect();
  document.getElementById('userDept').value = '';
  document.getElementById('userPosition').innerHTML = '<option value="">请先选择部门</option>';
  document.getElementById('userProcessGroup').style.display = 'none';
  
  renderUserRolesCheckboxes();
  document.getElementById('userModal').classList.add('show');
}

// 关闭用户模态框
function closeUserModal() {
  document.getElementById('userModal').classList.remove('show');
  currentEditUserId = null;
}

// 保存用户
function saveUser() {
  const name = document.getElementById('userName').value.trim();
  const nick = document.getElementById('userNick').value.trim();
  const dept = document.getElementById('userDept').value;
  const position = document.getElementById('userPosition').value;
  const phone = document.getElementById('userPhone').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const joinDate = document.getElementById('userJoinDate').value;
  const status = document.getElementById('userStatus').value;
  
  // 验证必填字段
  if (!name) {
    showToast('请输入用户名称', 'error');
    return;
  }
  if (!dept) {
    showToast('请选择所属部门', 'error');
    return;
  }
  if (!phone) {
    showToast('请输入手机号码', 'error');
    return;
  }
  if (!joinDate) {
    showToast('请选择入职日期', 'error');
    return;
  }
  
  // 收集选中的角色
  const roles = [];
  document.querySelectorAll('#userRolesCheckboxes input:checked').forEach(cb => {
    roles.push(cb.value);
  });
  
  // 如果是生产部，收集选中的工序
  const processes = [];
  if (dept === '生产部') {
    document.querySelectorAll('#userProcessCheckboxes input:checked').forEach(cb => {
      processes.push(cb.value);
    });
  }
  
  if (currentEditUserId) {
    // 编辑模式
    const user = employeeData.find(e => e.id === currentEditUserId);
    if (user) {
      user.name = name;
      user.nickname = nick;
      user.department = dept;
      user.position = position;
      user.phone = phone;
      user.email = email;
      user.joinDate = joinDate;
      user.status = status;
      user.roles = roles;
      user.processes = processes;
      showToast(`用户 ${name} 更新成功`);
    }
  } else {
    // 新增模式
    const newId = 'U' + String(employeeData.length + 1).padStart(3, '0');
    employeeData.push({
      id: newId,
      name: name,
      nickname: nick,
      department: dept,
      position: position,
      phone: phone,
      email: email,
      joinDate: joinDate,
      status: status,
      roles: roles,
      processes: processes
    });
    showToast(`用户 ${name} 添加成功`);
  }
  
  closeUserModal();
  renderUserTable();
  renderUserOrgTree(); // 刷新组织架构树中的人数统计
}

// 部门变化时更新岗位选项
function onUserDeptChange() {
  const dept = document.getElementById('userDept').value;
  const positionSelect = document.getElementById('userPosition');
  const processGroup = document.getElementById('userProcessGroup');
  
  if (!dept) {
    positionSelect.innerHTML = '<option value="">请先选择部门</option>';
    processGroup.style.display = 'none';
    return;
  }
  
  // 根据部门过滤岗位
  const deptPositions = positionData.filter(p => p.department === dept);
  positionSelect.innerHTML = '<option value="">请选择岗位</option>' + 
    deptPositions.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  
  // 如果是生产部，显示工序复选框
  if (dept === '生产部') {
    processGroup.style.display = 'block';
    renderUserProcessCheckboxes([]);
  } else {
    processGroup.style.display = 'none';
  }
}

// 渲染工序复选框
function renderUserProcessCheckboxes(selectedProcesses = []) {
  const container = document.getElementById('userProcessCheckboxes');
  if (!container) return;
  
  // 获取所有工序
  const allProcesses = processData || [];
  
  container.innerHTML = allProcesses.map(proc => {
    const checked = selectedProcesses.includes(proc.name) ? 'checked' : '';
    return `
      <label style="display:block;margin-bottom:8px;cursor:pointer;">
        <input type="checkbox" value="${proc.name}" ${checked} style="margin-right:8px;">
        ${proc.name}
      </label>
    `;
  }).join('');
}

// 渲染角色复选框
function renderUserRolesCheckboxes() {
  const container = document.getElementById('userRolesCheckboxes');
  if (!container) return;
  
  container.innerHTML = roleData.map(role => {
    const typeClass = role.type === '系统角色' ? 'admin' : role.type === '业务角色' ? 'manager' : 'guest';
    return `
      <label style="display:inline-block;margin-right:16px;margin-bottom:8px;cursor:pointer;">
        <input type="checkbox" value="${role.id}" style="margin-right:8px;">
        <span class="role-tag-inline ${typeClass}">${role.name}</span>
      </label>
    `;
  }).join('');
}

// 填充部门下拉框
function populateUserDeptSelect() {
  const deptSelect = document.getElementById('userDept');
  if (!deptSelect) return;
  
  deptSelect.innerHTML = '<option value="">请选择部门</option>' +
    organizationData.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("userTableBody")) renderUserTable();
});
