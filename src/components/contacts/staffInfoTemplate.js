let defineInfo = [
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '单行输入框',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '0',
    fixed: false,
    fieldDescription: '请输入',
    fieldOperations: {
      ruleContent: [], // 单选 日期有
      fieldContent: [] // 选项
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '多行输入框',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '1',
    fixed: false,
    fieldDescription: '请输入',
    fieldOperations: {
      ruleContent: [], // 单选 日期有
      fieldContent: [] // 选项
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '单选框',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '2',
    fixed: false,
    fieldDescription: '请选择',
    fieldOperations: {
      ruleContent: [],
      fieldContent: [{ type: 'radio', name: '选项1' }, { type: 'radio', name: '选项2' }, { type: 'radio', name: '选项3' }]
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '多选框',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '3',
    fixed: false,
    fieldDescription: '请选择',
    fieldOperations: {
      ruleContent: [],
      fieldContent: [{ type: 'checkbox', name: '选项1' }, { type: 'checkbox', name: '选项2' }, { type: 'checkbox', name: '选项3' }]
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '日期',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '4',
    fixed: false,
    fieldDescription: '请选择',
    fieldOperations: {
      typeValue: 'yyyy-MM-dd',
      ruleContent: [{ type: 'radio', name: '年-月-日', key: 'yyyy-MM-dd', isEdit: 1 }, { type: 'radio', name: '年-月', key: 'yyyy-MM', isEdit: 1 }],
      fieldContent: [] // 选项
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '日期区间',
    systemFlag: false,
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fieldType: '5',
    fixed: false,
    fieldOperations: {
      startName: '开始时间',
      endName: '结束时间',
      startDescription: '请选择开始时间',
      endDescription: '请选择结束时间',
      typeValue: 'yyyy-MM-dd',
      ruleContent: [{ type: 'radio', name: '年-月-日', key: 'yyyy-MM-dd', isEdit: 1 }, { type: 'radio', name: '年-月', key: 'yyyy-MM', isEdit: 1 }],
      fieldContent: [] // 选项
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '数字输入框',
    systemFlag: false,
    fieldType: '6', // 字段类型 数字输入框
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fixed: false,
    fieldDescription: '请输入',
    fieldOperations: {
      ruleContent: [], // 单选 日期有
      fieldContent: [], // 选项
      unit: '元' // 数字单位
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  },
  {
    parentCode: 'defineInfo',
    fieldCode: '-1',
    fieldName: '图片',
    systemFlag: false,
    fieldType: '7', // 字段类型
    fieldEdited: 1, // 修改（0：不可修改，1：可修改）
    fixed: false,
    fieldDescription: '最多上传9张图片',
    fieldOperations: {
      ruleContent: [], // 单选 日期有
      fieldContent: [] // 选项
    },
    isMust: false,
    staffRecordsIds: {
      staffVisible: '1',
      staffModify: '1'
    }
  }
];

let cardInfo = [
  {
    parentCode: 'cardInfo',
    fieldCode: '',
    name: '单行输入框',
    title: '',
    type: '',
    fixed: false
  }
];

let tradeInfo = [
  {
    parentCode: 'tradeInfo',
    fieldCode: '',
    name: '单行输入框',
    title: '',
    type: '',
    fixed: false
  }
];

let birthdayMemberInfo = [
  {
    parentCode: 'birthdayMemberInfo',
    fieldCode: '',
    name: '单行输入框',
    title: '',
    type: '',
    fixed: false
  }
];

let memberInfo = [
  {
    parentCode: 'memberInfo',
    fieldCode: '',
    name: '单行输入框',
    title: '',
    type: '',
    fixed: false
  }
];

let powerInfo = [
  {
    parentCode: 'powerInfo',
    fieldCode: '',
    name: '单行输入框',
    title: '',
    type: '',
    fixed: false
  }
];

export default {
  /* baseInfo: function() {
    return baseInfo;
  },
  jobInfo: function() {
    return jobInfo;
  },
  selfInfo: function() {
    return selfInfo;
  },
  eduInfo: function() {
    return eduInfo;
  },
  contractInfo: function() {
    return contractInfo;
  },
  contactInfo: function() {
    return contactInfo;
  },
  personalInfo: function() {
    return personalInfo;
  }, */
  cardInfo: function() {
    return cardInfo;
  },
  tradeInfo: function() {
    return tradeInfo;
  },
  birthdayMemberInfo: function() {
    return birthdayMemberInfo;
  },
  memberInfo: function() {
    return memberInfo;
  },
  powerInfo: function() {
    return powerInfo;
  },
  defineInfo: function() {
    return defineInfo;
  }
};
