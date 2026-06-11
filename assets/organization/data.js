// ========== Organization 组织架构页面数据 ==========

// 使用 base/data.js 中的 organizationData, positionData, employeeData

// 部门表格分页状态
let orgDeptPage = { page: 1, size: 10, total: 0 };
let orgPosPage = { page: 1, size: 10, total: 0 };

// 当前选中的部门过滤器
let currentOrgFilter = '';
