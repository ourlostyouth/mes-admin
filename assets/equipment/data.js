// ========== Equipment 设备管理页面数据 ==========

// 设备数据
let equipmentData = [
  { id: 'EQ-001', name: '成型机A', model: 'JX-2000', process: '成型', status: '正常' },
  { id: 'EQ-002', name: '成型机B', model: 'JX-2000', process: '成型', status: '需维护' },
  { id: 'EQ-003', name: '修理台A', model: 'XL-100', process: '修理', status: '正常' },
  { id: 'EQ-004', name: '修理台B', model: 'XL-100', process: '修理', status: '正常' },
  { id: 'EQ-005', name: '生检设备', model: 'SJ-200', process: '生检', status: '正常' },
  { id: 'EQ-006', name: '上釉设备A', model: 'SY-300', process: '上釉', status: '正常' },
  { id: 'EQ-007', name: '上釉设备B', model: 'SY-300', process: '上釉', status: '正常' },
  { id: 'EQ-008', name: '装车设备', model: 'ZC-400', process: '装车', status: '正常' },
  { id: 'EQ-009', name: '瓷检设备A', model: 'CJ-500', process: '瓷检', status: '正常' },
  { id: 'EQ-010', name: '瓷检设备B', model: 'CJ-500', process: '瓷检', status: '正常' },
  { id: 'EQ-011', name: '安装设备', model: 'AZ-600', process: '安装', status: '正常' },
  { id: 'EQ-012', name: '拉力测试机', model: 'LL-700', process: '拉力', status: '正常' },
  { id: 'EQ-013', name: '电检设备', model: 'DJ-800', process: '电检', status: '正常' },
  { id: 'EQ-014', name: '包装机A', model: 'BZ-300', process: '包装', status: '故障' },
  { id: 'EQ-015', name: '包装机B', model: 'BZ-300', process: '包装', status: '正常' }
];

// 当前编辑的设备ID
let currentEditEquipmentId = null;
