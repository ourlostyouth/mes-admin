// ========== Factory-modeling 页面函数 ==========

function renderFactoryTree() {
  const container = document.getElementById('factoryTreeContainer');
  if (!container) return;

  container.innerHTML = '<div class="org-tree">' +
    factoryData.map(parent => `
      <div class="org-tree-node">
        <div class="org-tree-node-content" onclick="selectFactoryNode('${parent.id}')" data-factory-id="${parent.id}">
          <div class="tree-toggle" onclick="event.stopPropagation();toggleFactoryNode(this, '${parent.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5l8 7-8 7z" fill="#94a3b8"/></svg>
          </div>
          <div class="tree-icon ${parent.icon === 'pc' ? 'pc-module' : 'pda-module'}">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>
          </div>
          <div class="tree-label">${parent.name}</div>
          <div class="tree-badge">${parent.children.length}个子模块</div>
        </div>
        <div class="org-tree-children" id="factoryChildren_${parent.id}">
          ${parent.children.map(child => `
            <div class="org-tree-node">
              <div class="org-tree-node-content" onclick="selectFactoryNode('${child.id}')" data-factory-id="${child.id}">
                <div class="tree-toggle leaf"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5l8 7-8 7z" fill="#94a3b8"/></svg></div>
                <div class="tree-icon sub-module">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 14v4h-2v-4h2zm0-4v-4h-2v4h2zm0 8v-2h-2v2h2zM5 15h10v2H5v-2zm0-4h10v2H5v-2zm0-4h10v2H5V7z"/></svg>
                </div>
                <div class="tree-label">${child.name}</div>
                <div class="tree-badge">${child.functions.length}项功能</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('') +
    '</div>';

  if (factoryData.length > 0 && factoryData[0].children.length > 0) {
    selectFactoryNode(factoryData[0].children[0].id);
  }
}

function toggleFactoryNode(el, id) {
  el.classList.toggle('expanded');
  const children = document.getElementById('factoryChildren_' + id);
  if (children) children.style.display = children.style.display === 'none' ? 'block' : 'none';
}

function selectFactoryNode(nodeId) {
  document.querySelectorAll('#factoryTreeContainer .org-tree-node-content').forEach(el => el.classList.remove('active'));
  const target = document.querySelector(`#factoryTreeContainer [data-factory-id="${nodeId}"]`);
  if (target) target.classList.add('active');

  currentFactoryNode = nodeId;
  document.getElementById('factoryEmptyState').style.display = 'none';
  document.getElementById('factoryContentPanel').style.display = 'block';
  document.getElementById('factorySaveBtn').style.display = 'inline-block';

  // 查找节点
  let node = null;
  for (const parent of factoryData) {
    if (parent.id === nodeId) { node = parent; break; }
    for (const child of parent.children) {
      if (child.id === nodeId) { node = child; break; }
    }
    if (node) break;
  }
  if (!node) return;

  document.getElementById('factoryRightTitle').textContent = `${node.name} - 配置`;

  // 基本信息
  const parentModule = factoryData.find(p => p.children.some(c => c.id === nodeId));
  const parentName = parentModule ? parentModule.name : node.name;

  if (node.type === 'parent') {
    document.getElementById('factoryBasicInfo').innerHTML = `
      <div class="config-form-item"><div class="config-form-label">模块名称</div><div class="config-form-value">${node.name}</div></div>
      <div class="config-form-item"><div class="config-form-label">模块类型</div><div class="config-form-value">${node.icon === 'pc' ? 'PC端' : 'PDA端'}</div></div>
      <div class="config-form-item"><div class="config-form-label">子模块数</div><div class="config-form-value">${node.children.length}</div></div>
      <div class="config-form-item"><div class="config-form-label">总功能数</div><div class="config-form-value">${node.children.reduce((s, c) => s + c.functions.length, 0)}</div></div>`;
    document.getElementById('factoryFuncSwitches').innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">请选择子模块查看功能开关配置</div>';
  } else {
    document.getElementById('factoryBasicInfo').innerHTML = `
      <div class="config-form-item"><div class="config-form-label">模块名称</div><div class="config-form-value"><input type="text" value="${node.name}" onchange="updateFactoryField('name', this.value)"></div></div>
      <div class="config-form-item"><div class="config-form-label">模块编码</div><div class="config-form-value"><input type="text" value="${node.code}" onchange="updateFactoryField('code', this.value)"></div></div>
      <div class="config-form-item"><div class="config-form-label">数据来源</div><div class="config-form-value"><input type="text" value="${node.dataSource}" onchange="updateFactoryField('dataSource', this.value)"></div></div>
      <div class="config-form-item"><div class="config-form-label">排序号</div><div class="config-form-value"><input type="number" value="${node.sortOrder}" onchange="updateFactoryField('sortOrder', this.value)"></div></div>
      <div class="config-form-item"><div class="config-form-label">所属终端</div><div class="config-form-value">${parentName}</div></div>
      <div class="config-form-item"><div class="config-form-label">功能数量</div><div class="config-form-value">${node.functions.length}</div></div>`;

    factoryConfigEdit = JSON.parse(JSON.stringify(node));

    document.getElementById('factoryFuncSwitches').innerHTML = node.functions.map(f => `
      <div class="function-switch-item">
        <div class="function-switch-info">
          <div class="function-switch-name">${f.name}</div>
          <div class="function-switch-desc">${f.desc}</div>
        </div>
        <div class="function-switch-control">
          <label class="toggle-switch">
            <input type="checkbox" ${f.enabled ? 'checked' : ''} onchange="toggleFactoryFunc('${f.key}', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    `).join('');
  }
}

function updateFactoryField(field, value) {
  factoryConfigEdit[field] = value;
}

function toggleFactoryFunc(key, enabled) {
  if (factoryConfigEdit.functions) {
    const func = factoryConfigEdit.functions.find(f => f.key === key);
    if (func) func.enabled = enabled;
  }
}

function saveFactoryConfig() {
  // 将编辑后的配置保存回源数据
  const nodeId = currentFactoryNode;
  for (const parent of factoryData) {
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].id === nodeId) {
        parent.children[i] = { ...parent.children[i], ...factoryConfigEdit };
        break;
      }
    }
  }
  showToast('模块配置保存成功');
  selectFactoryNode(nodeId);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("factoryTreeContainer")) renderFactoryTree();
});
