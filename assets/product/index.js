// ========== Product 产品管理页面函数 ==========

// 渲染产品表格
function renderProductTable(data = productData) {
  const tbody = document.getElementById('productTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.no}</td>
      <td>${item.name}</td>
      <td>${item.category || '-'}</td>
      <td>${item.spec || '-'}</td>
      <td>${item.weight ? item.weight + ' kg' : '-'}</td>
      <td>${item.color ? `<span class="status-badge" style="background:${item.color==='灰色'?'#e2e8f0':'#fde8cc'};color:${item.color==='灰色'?'#475569':'#92400e'}">${item.color}</span>` : '-'}</td>
      <td>${item.capModel || '-'}</td>
      <td>${item.footModel || '-'}</td>
      <td>${item.unit}</td>
      <td>${item.version}</td>
      <td><span class="status-badge ${item.status === '启用' ? 'normal' : 'warning'}">${item.status}</span></td>
      <td>
        <a class="action-link" onclick="editProduct('${item.id}')">编辑</a>
        <a class="action-link" style="color:#ef4444;margin-left:12px;" onclick="confirmDeleteProduct('${item.id}','${item.name}')">删除</a>
      </td>
    </tr>
  `).join('');
}

// 打开新增产品模态框
function openProductModal() {
  currentEditProductId = null;
  const title = document.getElementById('productModalTitle');
  const no = document.getElementById('prodNo');
  const name = document.getElementById('prodName');
  const category = document.getElementById('prodCategory');
  const spec = document.getElementById('prodSpec');
  const weight = document.getElementById('prodWeight');
  const color = document.getElementById('prodColor');
  const capModel = document.getElementById('prodCapModel');
  const footModel = document.getElementById('prodFootModel');
  const unit = document.getElementById('prodUnit');
  const version = document.getElementById('prodVersion');
  const status = document.getElementById('prodStatus');
  const modal = document.getElementById('productModal');
  
  if (title) title.textContent = '新增产品';
  if (no) no.value = '';
  if (name) name.value = '';
  if (category) category.value = '';
  if (spec) spec.value = '';
  if (weight) weight.value = '';
  if (color) color.value = '';
  if (capModel) capModel.value = '';
  if (footModel) footModel.value = '';
  if (unit) unit.value = '';
  if (version) version.value = 'V1.0';
  if (status) status.value = '启用';
  if (modal) modal.classList.add('show');
}

// 编辑产品
function editProduct(id) {
  currentEditProductId = id;
  const item = productData.find(d => d.id === id);
  if (!item) return;
  
  const title = document.getElementById('productModalTitle');
  const no = document.getElementById('prodNo');
  const name = document.getElementById('prodName');
  const category = document.getElementById('prodCategory');
  const spec = document.getElementById('prodSpec');
  const weight = document.getElementById('prodWeight');
  const color = document.getElementById('prodColor');
  const capModel = document.getElementById('prodCapModel');
  const footModel = document.getElementById('prodFootModel');
  const unit = document.getElementById('prodUnit');
  const version = document.getElementById('prodVersion');
  const status = document.getElementById('prodStatus');
  const modal = document.getElementById('productModal');
  
  if (title) title.textContent = '编辑产品';
  if (no) no.value = item.no;
  if (name) name.value = item.name;
  if (category) category.value = item.category || '';
  if (spec) spec.value = item.spec || '';
  if (weight) weight.value = item.weight || '';
  if (color) color.value = item.color || '';
  if (capModel) capModel.value = item.capModel || '';
  if (footModel) footModel.value = item.footModel || '';
  if (unit) unit.value = item.unit;
  if (version) version.value = item.version;
  if (status) status.value = item.status;
  if (modal) modal.classList.add('show');
}

// 关闭产品模态框
function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('show');
  currentEditProductId = null;
}

// 保存产品
function saveProduct() {
  const no = document.getElementById('prodNo')?.value.trim();
  const name = document.getElementById('prodName')?.value.trim();
  const category = document.getElementById('prodCategory')?.value.trim();
  const spec = document.getElementById('prodSpec')?.value.trim();
  const weight = document.getElementById('prodWeight')?.value.trim();
  const color = document.getElementById('prodColor')?.value;
  const capModel = document.getElementById('prodCapModel')?.value.trim();
  const footModel = document.getElementById('prodFootModel')?.value.trim();
  const unit = document.getElementById('prodUnit')?.value.trim();
  const version = document.getElementById('prodVersion')?.value.trim();
  const status = document.getElementById('prodStatus')?.value;

  if (!no) { showToast('请输入图号'); return; }
  if (!name) { showToast('请输入产品名称'); return; }

  if (currentEditProductId) {
    const index = productData.findIndex(d => d.id === currentEditProductId);
    if (index !== -1) {
      productData[index] = { ...productData[index], no, name, category, spec, weight, color, capModel, footModel, unit, version, status };
      showToast('产品更新成功');
    }
  } else {
    const newId = 'PROD-' + String(productData.length + 1).padStart(3, '0');
    productData.push({ id: newId, no, name, category, spec, weight, color, capModel, footModel, unit, version, status });
    showToast('产品新增成功');
  }

  renderProductTable();
  closeProductModal();
}

// 确认删除产品
function confirmDeleteProduct(id, name) {
  currentDeleteType = 'product';
  currentDeleteId = id;
  const hint = document.getElementById('deleteConfirmHint');
  const modal = document.getElementById('deleteModal');
  
  if (hint) hint.textContent = `确定要删除产品 "${name}" 吗？此操作不可恢复`;
  if (modal) modal.classList.add('show');
}

// 搜索产品
function searchProduct() {
  const keyword = document.getElementById('prodSearchInput')?.value.toLowerCase();
  if (!keyword) {
    renderProductTable();
    return;
  }
  
  const filtered = productData.filter(d =>
    d.no.toLowerCase().includes(keyword) ||
    d.name.toLowerCase().includes(keyword) ||
    (d.category || '').toLowerCase().includes(keyword)
  );
  renderProductTable(filtered);
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

  if (currentDeleteType === 'product') {
    productData = productData.filter(d => d.id !== currentDeleteId);
    renderProductTable();
    showToast('产品删除成功');
  }

  closeDeleteModal();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('productTableBody')) {
    renderProductTable();
  }
});
