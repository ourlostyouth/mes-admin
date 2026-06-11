// ========== 基础工具函数 ==========

// Toast提示
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ========== 分页辅助函数 ==========
function renderPagination(pageState, containerId, infoId, callback) {
  const totalPages = Math.ceil(pageState.total / pageState.size);
  const ctrl = document.getElementById(containerId);
  const info = document.getElementById(infoId);
  if (info) info.textContent = `共 ${pageState.total} 条`;
  if (!ctrl) return;

  let html = '';
  html += `<button class="pagination-btn" onclick="${callback}(1)" ${pageState.page <= 1 ? 'disabled' : ''}>«</button>`;
  html += `<button class="pagination-btn" onclick="${callback}(${pageState.page - 1})" ${pageState.page <= 1 ? 'disabled' : ''}>‹</button>`;
  html += `<span class="pagination-info">第 ${pageState.page}/${totalPages || 1} 页</span>`;
  html += `<button class="pagination-btn" onclick="${callback}(${pageState.page + 1})" ${pageState.page >= totalPages ? 'disabled' : ''}>›</button>`;
  html += `<button class="pagination-btn" onclick="${callback}(${totalPages})" ${pageState.page >= totalPages ? 'disabled' : ''}>»</button>`;
  ctrl.innerHTML = html;
}

// ========== 递归获取部门下所有子部门名称 ==========
function getAllDescendantDeptNames(deptName) {
  const names = [deptName];
  const children = organizationData.filter(d => d.parent === deptName);
  children.forEach(c => {
    names.push(...getAllDescendantDeptNames(c.name));
  });
  return names;
}


// ========== 注意 ==========
// 由于 common.js 文件较大（3391行），完整拆分需要大量工作
// 当前保留了原有的 js/common.js 和 css/common.css 以确保系统正常运行
// 
// 建议的迁移策略：
// 1. 保持当前结构，新页面使用新的 assets 组织方式
// 2. 逐步将旧代码迁移到对应的 assets 文件中
// 3. 每迁移一个模块就测试该模块功能
// 4. 全部迁移完成后删除原 common.js 和 common.css
//
// 详细拆分指南请查看: assets/SPLIT_GUIDE.md
