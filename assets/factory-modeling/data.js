// ========== Factory-modeling 页面数据 ==========

let factoryData = [
  {
    id: 'FM-PC',
    name: 'PC端模块',
    type: 'parent',
    icon: 'pc',
    children: [
      {
        id: 'FM-PC-PLAN', name: '生产规划', type: 'child', parent: 'FM-PC',
        code: 'PC_PLAN', dataSource: 'ERP同步', sortOrder: 1,
        functions: [
          { key: 'plan_view', name: '计划查看', desc: '查看生产计划列表', enabled: true },
          { key: 'plan_sync', name: '计划同步', desc: '从ERP同步生产订单', enabled: true },
          { key: 'plan_assign', name: '计划分配', desc: '分配计划到车间/产线', enabled: true },
          { key: 'plan_search', name: '计划搜索', desc: '按条件搜索生产计划', enabled: true },
          { key: 'plan_export', name: '计划导出', desc: '导出计划数据为Excel', enabled: false }
        ]
      },
      {
        id: 'FM-PC-REPORT', name: '报工管理', type: 'child', parent: 'FM-PC',
        code: 'PC_REPORT', dataSource: 'MES采集', sortOrder: 2,
        functions: [
          { key: 'report_view', name: '报工查看', desc: '查看报工记录', enabled: true },
          { key: 'report_edit', name: '报工修改', desc: '修改报工数据', enabled: true },
          { key: 'report_approve', name: '报工审核', desc: '审核报工记录', enabled: true },
          { key: 'report_stat', name: '报工统计', desc: '按维度统计报工数据', enabled: true },
          { key: 'report_export', name: '报工导出', desc: '导出报工报表', enabled: true }
        ]
      }
    ]
  },
  {
    id: 'FM-PDA',
    name: 'PDA端模块',
    type: 'parent',
    icon: 'pda',
    children: [
      {
        id: 'FM-PDA-RCV', name: '来料接收', type: 'child', parent: 'FM-PDA',
        code: 'PDA_RCV', dataSource: 'PDA录入', sortOrder: 1,
        functions: [
          { key: 'rcv_scan', name: '扫码接收', desc: '扫描条码接收来料', enabled: true },
          { key: 'rcv_input', name: '手动录入', desc: '手动录人来料信息', enabled: true },
          { key: 'rcv_reject', name: '来料拒收', desc: '拒收不合格来料', enabled: true },
          { key: 'rcv_query', name: '记录查询', desc: '查询接收记录', enabled: true },
          { key: 'rcv_stat', name: '接收统计', desc: '统计接收数据', enabled: false }
        ]
      },
      {
        id: 'FM-PDA-WORK', name: '报工操作', type: 'child', parent: 'FM-PDA',
        code: 'PDA_WORK', dataSource: 'PDA录入', sortOrder: 2,
        functions: [
          { key: 'work_report', name: '扫码报工', desc: '扫码完成工序报工', enabled: true },
          { key: 'work_batch', name: '批量报工', desc: '批量完成工序报工', enabled: true },
          { key: 'work_transfer', name: '移交下道', desc: '移交给下一道工序', enabled: true },
          { key: 'work_rework', name: '返修登记', desc: '登记返修品', enabled: false },
          { key: 'work_scrap', name: '报废登记', desc: '登记报废品', enabled: true }
        ]
      }
    ]
  }
];

