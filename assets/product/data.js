// ========== Product 产品管理页面数据 ==========

// 产品数据
let productData = [
  { id: 'PROD-001', no: '763', name: '产品A', category: 'XJ-763', spec: 'JX-763', weight: '2.50', color: '灰色', capModel: 'G-001', footModel: 'F-001', unit: '个', version: 'V2.0', status: '启用' },
  { id: 'PROD-002', no: '665', name: '产品B', category: 'TC-665', spec: 'CJ-665', weight: '3.20', color: '棕色', capModel: 'G-002', footModel: 'F-002', unit: '件', version: 'V1.0', status: '启用' },
  { id: 'PROD-003', no: '801', name: '产品C', category: 'MJ-801', spec: 'LJ-801', weight: '1.80', color: '灰色', capModel: 'G-001', footModel: 'F-003', unit: '个', version: 'V1.2', status: '启用' },
  { id: 'PROD-004', no: '902', name: '产品E', category: 'QT-902', spec: 'QT-902', weight: '4.00', color: '棕色', capModel: 'G-003', footModel: 'F-002', unit: '套', version: 'V1.0', status: '停用' },
  { id: 'PROD-005', no: '540', name: '产品F', category: 'TC-540', spec: 'TC-540', weight: '2.90', color: '灰色', capModel: 'G-002', footModel: 'F-001', unit: '件', version: 'V1.5', status: '启用' },
  { id: 'PROD-006', no: '388', name: '产品G', category: 'MJ-388', spec: 'MJ-388', weight: '1.50', color: '棕色', capModel: 'G-001', footModel: 'F-003', unit: '个', version: 'V2.1', status: '启用' }
];

// 当前编辑的产品ID
let currentEditProductId = null;
