// ========== Organization 页面函数 ==========

function renderOrgTree() {
  const container = document.getElementById('orgTreeContainer');
  if (!container) return;

  const rootDept = organizationData.find(d => d.parent === '-');
  if (!rootDept) return;

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
      <div class="org-tree-node-content" onclick="selectOrgDept('${dept.id}', '${dept.name}')" data-dept-id="${dept.id}">
        ${hasChildren ? `<div class="tree-toggle" onclick="event.stopPropagation();toggleOrgTreeNode(this, '${dept.id}')">
          <svg viewBox="0 0 24 24"><path d="M8 5l8 7-8 7z"/></svg>
        </div>` : `<div class="tree-toggle leaf"><svg viewBox="0 0 24 24"><path d="M8 5l8 7-8 7z"/></svg></div>`}
        <div class="tree-icon ${iconClass}">
          ${isRoot ? `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`
          : hasChildren ? `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`
          : `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`}
        </div>
        <div class="tree-label">${dept.name}</div>
        <div class="tree-badge">${empCount}人</div>
      </div>
      ${hasChildren ? `<div class="org-tree-children" id="orgChildren_${dept.id}">${children.map(c => buildTreeNode(c, level + 1)).join('')}</div>` : ''}
    </div>`;
  }

  container.innerHTML = '<div class="org-tree">' + buildTreeNode(rootDept, 1) + '</div>';

  // 默认选中第一个部门
  selectOrgDept(rootDept.id, rootDept.name);
}

function toggleOrgTreeNode(el, deptId) {
  el.classList.toggle('expanded');
  const children = document.getElementById('orgChildren_' + deptId);
  if (children) {
    children.style.display = children.style.display === 'none' ? 'block' : 'none';
  }
}

function selectOrgDept(id, name) {
  // 更新选中状态
  document.querySelectorAll('#orgTreeContainer .org-tree-node-content').forEach(el => el.classList.remove('active'));
  const target = document.querySelector(`#orgTreeContainer [data-dept-id="${id}"]`);
  if (target) target.classList.add('active');

  currentOrgFilter = id;
  switchOrgTab('dept');
  renderOrgDeptTable();
}

function switchOrgTab(tab) {
  // 更新tab样式
  document.querySelectorAll('#orgTabNav .tab-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#orgTabNav .tab-item').forEach(el => {
    if ((tab === 'dept' && el.textContent.includes('部门')) || (tab === 'pos' && el.textContent.includes('岗位'))) {
      el.classList.add('active');
    }
  });

  // 更新按钮
  const toolbar = document.getElementById('orgToolbarBtns');
  if (tab === 'dept') {
    toolbar.innerHTML = '<button class="btn-sm btn-sm-primary" onclick="openOrgModal()">+ 新增部门</button>';
  } else {
    toolbar.innerHTML = '<button class="btn-sm btn-sm-primary" onclick="openPosModal()">+ 新增岗位</button>';
  }

  // 更新搜索栏
  const searchBar = document.getElementById('orgSearchBar');
  if (tab === 'dept') {
    searchBar.innerHTML = `
      <input type="text" class="form-input-sm" id="orgSearchName" placeholder="部门名称" oninput="searchOrgData()">
      <input type="text" class="form-input-sm" id="orgSearchLeader" placeholder="负责人" oninput="searchOrgData()">
      <button class="btn-sm btn-sm-primary" onclick="searchOrgData()">搜索</button>
      <button class="btn-sm btn-sm-secondary" onclick="resetOrgSearch()">重置</button>`;
  } else {
    searchBar.innerHTML = `
      <input type="text" class="form-input-sm" id="orgSearchPosName" placeholder="岗位名称" oninput="searchPosData()">
      <select id="orgSearchPosDept" onchange="searchPosData()" style="padding:7px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;">
        <option value="">全部部门</option>
        ${organizationData.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
      </select>
      <button class="btn-sm btn-sm-primary" onclick="searchPosData()">搜索</button>
      <button class="btn-sm btn-sm-secondary" onclick="resetOrgSearch()">重置</button>`;
  }

  // 切换面板
  document.getElementById('orgDeptPanel').style.display = tab === 'dept' ? 'block' : 'none';
  document.getElementById('orgPosPanel').style.display = tab === 'pos' ? 'block' : 'none';

  if (tab === 'dept') {
    orgDeptPage.page = 1;
    renderOrgDeptTable();
  } else {
    orgPosPage.page = 1;
    renderOrgPosTable();
  }
}

function searchOrgData() {
  orgDeptPage.page = 1;
  renderOrgDeptTable();
}

function resetOrgSearch() {
  const nameInput = document.getElementById('orgSearchName');
  const leaderInput = document.getElementById('orgSearchLeader');
  const nameInput2 = document.getElementById('orgSearchPosName');
  const deptSelect = document.getElementById('orgSearchPosDept');
  if (nameInput) nameInput.value = '';
  if (leaderInput) leaderInput.value = '';
  if (nameInput2) nameInput2.value = '';
  if (deptSelect) deptSelect.value = '';
  orgDeptPage.page = 1;
  orgPosPage.page = 1;
  renderOrgDeptTable();
  renderOrgPosTable();
}

function searchPosData() {
  orgPosPage.page = 1;
  renderOrgPosTable();
}

function renderOrgDeptTable() {
  const nameFilter = (document.getElementById('orgSearchName')?.value || '').toLowerCase();
  const leaderFilter = (document.getElementById('orgSearchLeader')?.value || '').toLowerCase();

  let data = organizationData;
  if (currentOrgFilter) {
    const selDept = organizationData.find(d => d.id === currentOrgFilter);
    if (selDept) {
      // 显示该部门及其所有子部门
      const deptNames = getAllDescendantDeptNames(selDept.name);
      data = organizationData.filter(d => deptNames.includes(d.name));
    }
  }

  if (nameFilter) data = data.filter(d => d.name.toLowerCase().includes(nameFilter));
  if (leaderFilter) data = data.filter(d => d.leader.toLowerCase().includes(leaderFilter));

  orgDeptPage.total = data.length;
  const start = (orgDeptPage.page - 1) * orgDeptPage.size;
  const pageData = data.slice(start, start + orgDeptPage.size);

  const tbody = document.getElementById('orgDeptTableBody');
  if (!tbody) return;

  tbody.innerHTML = pageData.map(item => {
    const isTopLevel = item.parent === '-';
    const parentDisplay = isTopLevel ? '<span style="color:#94a3b8;">-</span>' : `<span class="org-parent-name">${item.parent}</span>`;
    return `<tr>
      <td>${item.id}</td>
      <td class="${isTopLevel ? 'org-level-0' : 'org-level-1'}">${item.name}</td>
      <td>${parentDisplay}</td>
      <td>${item.leader}</td>
      <td><span style="font-weight:600;color:${item.people > 0 ? '#22c55e' : '#94a3b8'}">${item.people}</span></td>
      <td>${item.phone}</td>
      <td>${item.createTime}</td>
      <td>
        <div class="table-actions-col">
          <a class="action-link" onclick="viewDepartmentMembers('${item.id}','${item.name}')">人员</a>
          <a class="action-link" onclick="editOrg('${item.id}')">编辑</a>
          <a class="action-link danger" onclick="confirmDeleteOrg('${item.id}','${item.name}')">删除</a>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination(orgDeptPage, 'orgDeptPageCtrl', 'orgDeptPageInfo', 'goOrgDeptPage');
}

function goOrgDeptPage(page, size) {
  if (size) orgDeptPage.size = parseInt(size);
  orgDeptPage.page = page;
  renderOrgDeptTable();
}

function renderOrgPosTable() {
  const nameFilter = (document.getElementById('orgSearchPosName')?.value || '').toLowerCase();
  const deptFilter = document.getElementById('orgSearchPosDept')?.value || '';

  let data = positionData;
  if (currentOrgFilter) {
    const selDept = organizationData.find(d => d.id === currentOrgFilter);
    if (selDept) {
      const deptNames = getAllDescendantDeptNames(selDept.name);
      data = data.filter(p => deptNames.includes(p.department));
    }
  }

  if (nameFilter) data = data.filter(p => p.name.toLowerCase().includes(nameFilter));
  if (deptFilter) data = data.filter(p => p.department === deptFilter);

  orgPosPage.total = data.length;
  const start = (orgPosPage.page - 1) * orgPosPage.size;
  const pageData = data.slice(start, start + orgPosPage.size);

  const tbody = document.getElementById('orgPosTableBody');
  if (!tbody) return;

  tbody.innerHTML = pageData.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.department}</td>
      <td>${item.type}</td>
      <td><span class="status-badge ${item.status === '启用' ? 'normal' : 'error'}">${item.status}</span></td>
      <td>
        <div class="table-actions-col">
          <a class="action-link" onclick="editPos('${item.id}')">编辑</a>
          <a class="action-link danger" onclick="confirmDeletePos('${item.id}','${item.name}')">删除</a>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination(orgPosPage, 'orgPosPageCtrl', 'orgPosPageInfo', 'goOrgPosPage');
}

function goOrgPosPage(page, size) {
  if (size) orgPosPage.size = parseInt(size);
  orgPosPage.page = page;
  renderOrgPosTable();
}

function confirmDeletePos(id, name) {
  currentDeleteType = 'position';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除岗位 "${name}" 吗？此操作不可恢复`;
  document.getElementById('deleteModal').classList.add('show');
}

function openOrgModal() {
  currentEditId = null;
  document.getElementById('orgModalTitle').textContent = '新增部门';
  document.getElementById('orgName').value = '';
  document.getElementById('orgLeader').value = '';
  document.getElementById('orgPeople').value = 0;
  document.getElementById('orgPhone').value = '';
  document.getElementById('orgModal').classList.add('show');
}

function editOrg(id) {
  currentEditId = id;
  const item = organizationData.find(d => d.id === id);
  if (!item) return;

  document.getElementById('orgModalTitle').textContent = '编辑部门';
  document.getElementById('orgName').value = item.name;
  document.getElementById('orgLeader').value = item.leader;
  document.getElementById('orgPeople').value = item.people;
  document.getElementById('orgPhone').value = item.phone;
  document.getElementById('orgModal').classList.add('show');
}

function closeOrgModal() {
  document.getElementById('orgModal').classList.remove('show');
  currentEditId = null;
}

function saveOrg() {
  const name = document.getElementById('orgName').value.trim();
  const leader = document.getElementById('orgLeader').value.trim();
  const people = parseInt(document.getElementById('orgPeople').value) || 0;
  const phone = document.getElementById('orgPhone').value.trim();

  if (!name) {
    showToast('请输入部门名称');
    return;
  }
  if (!leader) {
    showToast('请输入负责人');
    return;
  }

  if (currentEditId) {
    // 编辑
    const index = organizationData.findIndex(d => d.id === currentEditId);
    if (index !== -1) {
      organizationData[index] = {
        ...organizationData[index],
        name, leader, people, phone
      };
      showToast('部门更新成功');
    }
  } else {
    // 新增
    const newId = 'DEPT-' + String(organizationData.length + 1).padStart(3, '0');
    const newDept = {
      id: newId,
      name,
      parent: '-',
      leader,
      people,
      phone,
      createTime: new Date().toISOString().split('T')[0]
    };
    organizationData.push(newDept);
    showToast('部门新增成功');
  }

  renderOrgTree();
  renderOrgDeptTable();
  closeOrgModal();
}

function confirmDeleteOrg(id, name) {
  currentDeleteType = 'organization';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除 "${name}" 吗？此操作不可恢复`;
  document.getElementById('deleteModal').classList.add('show');
}

function openPosModal() {
  currentEditId = null;
  document.getElementById('posModalTitle').textContent = '新增岗位';
  document.getElementById('posName').value = '';
  document.getElementById('posDepartment').value = '';
  document.getElementById('posType').value = '';
  document.getElementById('posStatus').value = '启用';
  document.getElementById('posModal').classList.add('show');
}

function editPos(id) {
  currentEditId = id;
  const item = positionData.find(d => d.id === id);
  if (!item) return;

  document.getElementById('posModalTitle').textContent = '编辑岗位';
  document.getElementById('posName').value = item.name;
  document.getElementById('posDepartment').value = item.department;
  document.getElementById('posType').value = item.type;
  document.getElementById('posStatus').value = item.status;
  document.getElementById('posModal').classList.add('show');
}

function closePosModal() {
  document.getElementById('posModal').classList.remove('show');
  currentEditId = null;
}

function savePos() {
  const name = document.getElementById('posName').value.trim();
  const department = document.getElementById('posDepartment').value;
  const type = document.getElementById('posType').value;
  const status = document.getElementById('posStatus').value;

  if (!name) {
    showToast('请输入岗位名称');
    return;
  }
  if (!department) {
    showToast('请选择所属部门');
    return;
  }
  if (!type) {
    showToast('请选择岗位类别');
    return;
  }

  if (currentEditId) {
    // 编辑
    const index = positionData.findIndex(d => d.id === currentEditId);
    if (index !== -1) {
      positionData[index] = {
        ...positionData[index],
        name, department, type, status
      };
      showToast('岗位更新成功');
    }
  } else {
    // 新增
    const newId = 'POS-' + String(positionData.length + 1).padStart(3, '0');
    const newPos = {
      id: newId,
      name,
      department,
      type,
      status
    };
    positionData.push(newPos);
    showToast('岗位新增成功');
  }

  renderOrgPosTable();
  closePosModal();
}

function viewDepartmentMembers(deptId, deptName) {
  currentDepartmentId = deptName; // 改为存储部门名称而不是ID
  document.getElementById('memberModalTitle').textContent = `${deptName} - 人员列表`;
  document.getElementById('currentDepartmentId').value = deptId;
  renderMemberTable();
  document.getElementById('memberModal').classList.add('show');
}

function renderMemberTable(data = null) {
  const tbody = document.getElementById('memberTableBody');
  if (!tbody) return;

  let deptMembers;
  
  if (data) {
    // 使用传入的数据
    deptMembers = data;
  } else {
    // 获取当前部门及其所有子部门的名称
    const selectedDept = organizationData.find(d => d.name === currentDepartmentId);
    if (selectedDept) {
      // 获取当前部门及所有子部门
      const allDeptNames = getAllDescendantDeptNames(currentDepartmentId);
      deptMembers = employeeData.filter(emp => allDeptNames.includes(emp.department));
    } else {
      deptMembers = [];
    }
  }

  tbody.innerHTML = deptMembers.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.position}</td>
      <td>${item.phone}</td>
      <td><span class="status-badge ${item.status === '在职' ? 'normal' : 'warning'}">${item.status}</span></td>
      <td>
        <a class="action-link" onclick="editMember('${item.id}')">编辑</a>
        <a class="action-link" style="color:#ef4444;margin-left:12px;" onclick="confirmDeleteMember('${item.id}','${item.name}')">删除</a>
      </td>
    </tr>
  `).join('');

  if (deptMembers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:40px;">暂无人员</td></tr>';
  }
}

function openAddMemberModal() {
  currentEditMemberId = null;
  document.getElementById('addMemberModalTitle').textContent = '添加人员';
  document.getElementById('memberName').value = '';
  document.getElementById('memberPosition').value = '';
  document.getElementById('memberPhone').value = '';
  document.getElementById('memberEmail').value = '';
  document.getElementById('memberStatus').value = '在职';
  document.getElementById('addMemberModal').classList.add('show');
}

function editMember(id) {
  currentEditMemberId = id;
  const item = employeeData.find(emp => emp.id === id);
  if (!item) return;

  document.getElementById('addMemberModalTitle').textContent = '编辑人员';
  document.getElementById('memberName').value = item.name;
  document.getElementById('memberPosition').value = item.position;
  document.getElementById('memberPhone').value = item.phone;
  document.getElementById('memberEmail').value = item.email;
  document.getElementById('memberStatus').value = item.status;
  document.getElementById('addMemberModal').classList.add('show');
}

function closeAddMemberModal() {
  document.getElementById('addMemberModal').classList.remove('show');
  currentEditMemberId = null;
}

function saveMember() {
  const name = document.getElementById('memberName').value.trim();
  const position = document.getElementById('memberPosition').value.trim();
  const phone = document.getElementById('memberPhone').value.trim();
  const email = document.getElementById('memberEmail').value.trim();
  const status = document.getElementById('memberStatus').value;

  if (!name) {
    showToast('请输入姓名');
    return;
  }
  if (!position) {
    showToast('请输入岗位');
    return;
  }

  const dept = organizationData.find(d => d.id === currentDepartmentId);
  if (!dept) {
    showToast('部门信息不存在');
    return;
  }

  if (currentEditMemberId) {
    // 编辑
    const index = employeeData.findIndex(emp => emp.id === currentEditMemberId);
    if (index !== -1) {
      employeeData[index] = {
        ...employeeData[index],
        name, position, phone, email, status
      };
      showToast('人员更新成功');
    }
  } else {
    // 新增
    const newId = 'EMP-' + String(employeeData.length + 1).padStart(3, '0');
    const newMember = {
      id: newId,
      name,
      department: dept.name,
      position,
      phone,
      email,
      status
    };
    employeeData.push(newMember);

    // 更新部门人数
    dept.people++;
    renderOrgTree();
    renderOrgDeptTable();
    showToast('人员添加成功');
  }

  renderMemberTable();
  closeAddMemberModal();
}

function confirmDeleteMember(id, name) {
  currentDeleteType = 'member';
  currentDeleteId = id;
  document.getElementById('deleteConfirmHint').textContent = `确定要删除 "${name}" 吗？此操作不可恢复`;
  document.getElementById('deleteModal').classList.add('show');
}

function deleteMember(id) {
  const member = employeeData.find(emp => emp.id === id);
  if (!member) return;

  // 从人员列表中删除
  employeeData = employeeData.filter(emp => emp.id !== id);

  // 更新部门人数
  const dept = organizationData.find(d => d.name === member.department);
  if (dept && dept.people > 0) {
    dept.people--;
  }

  renderOrgTree();
  renderOrgDeptTable();
  renderMemberTable();
  showToast('人员删除成功');
}

function getAllDescendantDeptNames(deptName) {
  const names = [deptName];
  const children = organizationData.filter(d => d.parent === deptName);
  children.forEach(c => {
    names.push(...getAllDescendantDeptNames(c.name));
  });
  return names;
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

  switch (currentDeleteType) {
    case 'organization':
      organizationData = organizationData.filter(d => d.id !== currentDeleteId);
      renderOrgTree();
      renderOrgDeptTable();
      showToast('部门删除成功');
      break;
    case 'position':
      positionData = positionData.filter(d => d.id !== currentDeleteId);
      renderOrgPosTable();
      showToast('岗位删除成功');
      break;
    case 'member':
      deleteMember(currentDeleteId);
      break;
  }

  closeDeleteModal();
}

// 关闭人员模态框
function closeMemberModal() {
  document.getElementById('memberModal').classList.remove('show');
  currentDepartmentId = null;
}

// 搜索人员
function searchMember() {
  const keyword = document.getElementById('memberSearchInput')?.value.toLowerCase() || '';
  if (!keyword) {
    renderMemberTable();
    return;
  }
  
  // 获取当前部门及所有子部门
  const allDeptNames = getAllDescendantDeptNames(currentDepartmentId);
  
  const filtered = employeeData.filter(emp => {
    return allDeptNames.includes(emp.department) && (
      emp.name.toLowerCase().includes(keyword) ||
      emp.position.toLowerCase().includes(keyword) ||
      emp.phone.includes(keyword)
    );
  });
  
  renderMemberTable(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("orgTreeContainer")) renderOrgTree();
});
