// ========== Report-receive 页面函数 ==========

function renderReceiveTable(data = receiveData) {
  const tbody = document.getElementById('rcvTableBody');
  if (!tbody) return;
  const statusMap = { 'received': 'normal', 'pending': 'warning', 'exception': 'error' };

  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${r.drawingNo}</td>
      <td>${r.productName}</td>
      <td>${r.fromDept}</td>
      <td>${r.qty}</td>
      <td style="color:${r.status==='pending'?'#999':'#166534'}">${r.status==='pending'?'—':r.acceptQty}</td>
      <td style="color:${r.rejectQty>0?'#991b1b':'#166534'}">${r.rejectQty}</td>
      <td><span class="status-badge ${statusMap[r.status]}">${r.statusText}</span></td>
      <td>${r.operator}</td>
      <td>${r.time}</td>
    </tr>
  `).join('');

  // 更新统计
  document.getElementById('rcvPendingCount').textContent = receiveData.filter(d => d.status === 'pending').length;
  document.getElementById('rcvDoneCount').textContent = receiveData.filter(d => d.status === 'received').length;
  document.getElementById('rcvExceptionCount').textContent = receiveData.filter(d => d.status === 'exception').length;
  document.getElementById('rcvTotalCount').textContent = receiveData.length;
}

function renderReceiveModuleTable(data = receiveData) {
  const tbody = document.getElementById('receiveTableBody');
  if (!tbody) return;
  const statusMap = { 'received': 'normal', 'pending': 'warning', 'exception': 'error' };

  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${r.drawingNo}</td>
      <td>${r.productName}</td>
      <td><span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-size:12px;">${r.receiveProcess}</span></td>
      <td><span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:12px;">${r.previousProcess}</span></td>
      <td>${r.qty}</td>
      <td style="color:${r.status==='pending'?'#999':'#166534'}">${r.status==='pending'?'—':r.acceptQty}</td>
      <td style="color:${r.rejectQty>0?'#991b1b':'#166534'}">${r.rejectQty}</td>
      <td><span class="status-badge ${statusMap[r.status]}">${r.statusText}</span></td>
      <td>${r.operator}</td>
      <td>${r.time}</td>
    </tr>
  `).join('');

  // 更新统计
  document.getElementById('receivePendingCount').textContent = receiveData.filter(d => d.status === 'pending').length;
  document.getElementById('receiveDoneCount').textContent = receiveData.filter(d => d.status === 'received').length;
  document.getElementById('receiveExceptionCount').textContent = receiveData.filter(d => d.status === 'exception').length;
  document.getElementById('receiveTotalCount').textContent = receiveData.length;
}

function searchReceiveData() {
  const kw = document.getElementById('rcvSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderReceiveTable(receiveData);
    return;
  }
  const filtered = receiveData.filter(d =>
    d.id.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw) ||
    d.productName.toLowerCase().includes(kw)
  );
  renderReceiveTable(filtered);
}

function searchReceiveModuleData() {
  const kw = document.getElementById('receiveSearchInput')?.value.toLowerCase();
  if (!kw) {
    renderReceiveModuleTable(receiveData);
    return;
  }
  const filtered = receiveData.filter(d =>
    d.id.toLowerCase().includes(kw) ||
    d.drawingNo.toLowerCase().includes(kw) ||
    d.productName.toLowerCase().includes(kw) ||
    d.receiveProcess.toLowerCase().includes(kw) ||
    d.previousProcess.toLowerCase().includes(kw)
  );
  renderReceiveModuleTable(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("rcvTableBody")) renderReceiveTable();
});
