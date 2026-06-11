// ========== 共用基础数据 ==========

// 组织架构数据
let organizationData = [
  { id: 'DEPT-000', name: '大连电瓷集团', parent: '-', leader: '', people: 30, phone: '', createTime: '2024-01-01' },
  { id: 'DEPT-001', name: '生产部', parent: '大连电瓷集团', leader: '张经理', people: 15, phone: '138****8888', createTime: '2024-01-01' },
  { id: 'DEPT-002', name: '成型车间', parent: '生产部', leader: '李主任', people: 7, phone: '138****1111', createTime: '2024-01-05' },
  { id: 'DEPT-005', name: '综管部', parent: '大连电瓷集团', leader: '王经理', people: 8, phone: '138****2222', createTime: '2024-01-10' }
];

// 人员数据
let employeeData = [
  { id: 'EMP-001', name: '张经理', department: '生产部', position: '部门经理', phone: '138****8888', email: 'zhang@company.com', joinDate: '2020-01-01', status: '在职', roles: ['ROLE-001'], processes: ['成型', '修理', '生检', '上釉', '装车', '瓷检'] },
  { id: 'EMP-014', name: '张三', department: '生产部', position: '设备维护', phone: '139****0010', email: 'zhangsan2@company.com', joinDate: '2023-04-10', status: '在职', roles: ['ROLE-003'], processes: ['成型', '安装', '电检'] },
  { id: 'EMP-015', name: '李四', department: '生产部', position: '设备维护', phone: '139****0011', email: 'lisi2@company.com', joinDate: '2023-07-25', status: '在职', roles: ['ROLE-003'], processes: ['成型', '修理', '包装'] },
  { id: 'EMP-016', name: '王五', department: '生产部', position: '设备维护', phone: '139****0012', email: 'wangwu2@company.com', joinDate: '2023-10-15', status: '在职', roles: ['ROLE-003'], processes: ['上釉', '装车'] },
  { id: 'EMP-017', name: '赵六', department: '生产部', position: '设备维护', phone: '139****0013', email: 'zhaoliu@company.com', joinDate: '2024-01-05', status: '在职', roles: ['ROLE-003'], processes: ['修理', '拉力'] },
  { id: 'EMP-018', name: '钱明', department: '生产部', position: '生产计划员', phone: '139****0014', email: 'qianming@company.com', joinDate: '2023-02-15', status: '在职', roles: ['ROLE-002'] },
  { id: 'EMP-019', name: '孙华', department: '生产部', position: '生产计划员', phone: '139****0015', email: 'sunhua@company.com', joinDate: '2023-05-20', status: '在职', roles: ['ROLE-002'] },
  { id: 'EMP-020', name: '周强', department: '生产部', position: '生产主管', phone: '139****0016', email: 'zhouqiang@company.com', joinDate: '2022-11-10', status: '在职', roles: ['ROLE-002'], processes: ['成型', '修理', '装车', '瓷检', '包装'] },
  { id: 'EMP-002', name: '李主任', department: '成型车间', position: '车间主任', phone: '138****1111', email: 'li@company.com', joinDate: '2020-03-15', status: '在职', roles: ['ROLE-002'], processes: ['成型', '修理'] },
  { id: 'EMP-005', name: '张三', department: '成型车间', position: '操作员', phone: '139****0001', email: 'zhangsan@company.com', joinDate: '2021-01-05', status: '在职', roles: ['ROLE-003'], processes: ['成型'] },
  { id: 'EMP-006', name: '李四', department: '成型车间', position: '操作员', phone: '139****0002', email: 'lisi@company.com', joinDate: '2021-03-20', status: '在职', roles: ['ROLE-003'], processes: ['成型'] },
  { id: 'EMP-007', name: '王五', department: '成型车间', position: '操作员', phone: '139****0003', email: 'wangwu@company.com', joinDate: '2021-06-15', status: '在职', roles: ['ROLE-003'], processes: ['成型'] },
  { id: 'EMP-021', name: '陈伟', department: '成型车间', position: '操作员', phone: '139****0017', email: 'chenwei@company.com', joinDate: '2022-03-25', status: '在职', roles: ['ROLE-003'], processes: ['成型', '修理'] },
  { id: 'EMP-022', name: '杨洋', department: '成型车间', position: '操作员', phone: '139****0018', email: 'yangyang@company.com', joinDate: '2022-06-30', status: '在职', roles: ['ROLE-003'], processes: ['成型', '装车'] },
  { id: 'EMP-023', name: '刘丽', department: '成型车间', position: '操作员', phone: '139****0019', email: 'liuli@company.com', joinDate: '2022-09-15', status: '在职', roles: ['ROLE-003'], processes: ['成型'] },
  { id: 'EMP-024', name: '黄涛', department: '成型车间', position: '质检员', phone: '139****0020', email: 'huangtao@company.com', joinDate: '2023-01-08', status: '在职', roles: ['ROLE-003'], processes: ['生检'] },
  { id: 'EMP-003', name: '王主任', department: '综管部', position: '部门经理', phone: '138****2222', email: 'wang@company.com', joinDate: '2020-06-01', status: '在职', roles: ['ROLE-002'], processes: ['生检', '电检', '拉力'] },
  { id: 'EMP-008', name: '钱七', department: '综管部', position: '质检员', phone: '139****0004', email: 'qianqi@company.com', joinDate: '2021-09-01', status: '在职', roles: ['ROLE-003'], processes: ['生检'] },
  { id: 'EMP-009', name: '孙八', department: '综管部', position: '质检员', phone: '139****0005', email: 'sunba@company.com', joinDate: '2021-11-20', status: '在职', roles: ['ROLE-003'], processes: ['生检', '电检'] },
  { id: 'EMP-010', name: '周九', department: '综管部', position: '质检员', phone: '139****0006', email: 'zhoujiu@company.com', joinDate: '2022-02-10', status: '在职', roles: ['ROLE-003'], processes: ['生检'] },
  { id: 'EMP-011', name: '吴十', department: '综管部', position: '质检员', phone: '139****0007', email: 'wushi@company.com', joinDate: '2022-05-05', status: '在职', roles: ['ROLE-003'], processes: ['电检'] },
  { id: 'EMP-025', name: '林峰', department: '综管部', position: '质检主管', phone: '139****0021', email: 'linfeng@company.com', joinDate: '2021-12-15', status: '在职', roles: ['ROLE-002'], processes: ['生检', '电检', '拉力'] },
  { id: 'EMP-026', name: '徐敏', department: '综管部', position: '质检员', phone: '139****0022', email: 'xumin@company.com', joinDate: '2022-07-20', status: '在职', roles: ['ROLE-003'], processes: ['生检'] },
  { id: 'EMP-027', name: '马超', department: '综管部', position: '质检员', phone: '139****0023', email: 'machao@company.com', joinDate: '2022-10-25', status: '在职', roles: ['ROLE-003'], processes: ['电检', '拉力'] },
  { id: 'EMP-004', name: '赵主任', department: '综管部', position: '车间主任', phone: '138****3333', email: 'zhao@company.com', joinDate: '2020-08-10', status: '在职', roles: ['ROLE-002'], processes: ['瓷检', '安装', '包装'] },
  { id: 'EMP-012', name: '郑一', department: '综管部', position: '瓷检员', phone: '139****0008', email: 'zhengyi@company.com', joinDate: '2022-08-15', status: '在职', roles: ['ROLE-003'], processes: ['瓷检'] },
  { id: 'EMP-013', name: '王二', department: '综管部', position: '瓷检员', phone: '139****0009', email: 'wanger@company.com', joinDate: '2023-01-20', status: '在职', roles: ['ROLE-003'], processes: ['瓷检'] },
  { id: 'EMP-028', name: '郭刚', department: '综管部', position: '瓷检员', phone: '139****0024', email: 'guogang@company.com', joinDate: '2023-04-05', status: '在职', roles: ['ROLE-003'], processes: ['瓷检', '安装'] },
  { id: 'EMP-029', name: '何静', department: '综管部', position: '瓷检员', phone: '139****0025', email: 'hejing@company.com', joinDate: '2023-07-10', status: '在职', roles: ['ROLE-003'], processes: ['瓷检'] },
  { id: 'EMP-030', name: '宋杰', department: '综管部', position: '瓷检员', phone: '139****0026', email: 'songjie@company.com', joinDate: '2023-10-20', status: '在职', roles: ['ROLE-003'], processes: ['瓷检', '包装'] }
];

// 岗位数据
let positionData = [
  { id: 'POS-001', name: '成型操作员', department: '成型车间', type: '操作岗', status: '启用' },
  { id: 'POS-002', name: '瓷检员', department: '综管部', type: '质检岗', status: '启用' },
  { id: 'POS-003', name: '设备维护员', department: '生产部', type: '技术岗', status: '启用' },
  { id: 'POS-004', name: '生产主管', department: '生产部', type: '管理岗', status: '启用' },
  { id: 'POS-005', name: '临时工', department: '成型车间', type: '操作岗', status: '停用' }
];

// 角色数据
let roleData = [
  { id: 'ROLE-001', name: '超级管理员', type: '系统角色', users: 1, permissions: ['plan', 'report', 'equipment', 'product', 'permission', 'log'], createTime: '2024-01-01', status: '启用' },
  { id: 'ROLE-002', name: '部门主管', type: '业务角色', users: 2, permissions: ['plan', 'report', 'product'], createTime: '2024-01-05', status: '启用' },
  { id: 'ROLE-003', name: '操作员', type: '业务角色', users: 8, permissions: ['report'], createTime: '2024-01-10', status: '启用' },
  { id: 'ROLE-004', name: '访客', type: '临时角色', users: 1, permissions: [], createTime: '2024-02-15', status: '停用' }
];


// ========== 权限菜单树结构（共用）==========
const menuPermissions = [
  {
    id: 'plan',
    name: '计划管理',
    operations: ['add', 'edit', 'delete', 'view']
  },
  {
    id: 'report',
    name: '报工管理',
    operations: ['add', 'edit', 'delete', 'view']
  },
  {
    id: 'equipment',
    name: '设备管理',
    operations: ['add', 'edit', 'delete', 'view']
  },
  {
    id: 'product',
    name: '产品管理',
    operations: ['add', 'edit', 'delete', 'view']
  },
  {
    id: 'permission',
    name: '权限管理',
    operations: ['add', 'edit', 'delete', 'view']
  },
  {
    id: 'log',
    name: '日志管理',
    operations: ['view']
  }
];

// 分页状态（共用）
let orgDeptPage = { page: 1, size: 10, total: 0 };
let orgPosPage = { page: 1, size: 10, total: 0 };
let userPage = { page: 1, size: 10, total: 0 };
let currentOrgFilter = '';
let currentUserFilterDept = null;

// 全局编辑/删除状态
let currentEditId = null;
let currentEditUserId = null;
let currentDeleteType = null;
let currentDeleteId = null;
