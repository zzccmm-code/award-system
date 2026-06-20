export interface AwardRecord {
  id: number;
  projectName: string;
  awardYear: number;
  awardType: string;
  awardLevel: string;
  completingUnit: string;
  completers: string;
  source: string;
}

export const mockAwardTypeOptions = [
  '科技进步奖',
  '技术发明奖',
  '自然科学奖',
  '专利奖',
  '标准创新奖',
  '优秀工程奖',
];

export const mockData: AwardRecord[] = [
  {
    id: 1,
    projectName: '特高压输电线路智能化运维关键技术及应用',
    awardYear: 2024,
    awardType: '科技进步奖',
    awardLevel: '一等奖',
    completingUnit: '国家电网有限公司, 中国电力科学研究院',
    completers: '张三, 李四, 王五, 赵六',
    source: '国家电网科技部',
  },
  {
    id: 2,
    projectName: '新型电力系统源网荷储协调控制技术',
    awardYear: 2024,
    awardType: '技术发明奖',
    awardLevel: '一等奖',
    completingUnit: '南方电网科学研究院, 清华大学',
    completers: '刘一, 陈二, 周三',
    source: '南方电网公司',
  },
  {
    id: 3,
    projectName: '海上风电柔性直流输电关键技术及工程应用',
    awardYear: 2023,
    awardType: '科技进步奖',
    awardLevel: '特等奖',
    completingUnit: '中国华能集团有限公司, 上海交通大学',
    completers: '孙七, 周八, 吴九, 郑十',
    source: '中国电机工程学会',
  },
  {
    id: 4,
    projectName: '高比例可再生能源电力系统规划与运行关键技术',
    awardYear: 2023,
    awardType: '自然科学奖',
    awardLevel: '二等奖',
    completingUnit: '清华大学, 华北电力大学',
    completers: '钱一, 孙二, 李三',
    source: '教育部',
  },
  {
    id: 5,
    projectName: '电力物联网边缘智能计算平台研发与应用',
    awardYear: 2024,
    awardType: '科技进步奖',
    awardLevel: '二等奖',
    completingUnit: '国网信息通信产业集团有限公司',
    completers: '杨四, 朱五, 马六',
    source: '国家电网科技部',
  },
  {
    id: 6,
    projectName: '大型抽水蓄能电站机组关键技术及工程应用',
    awardYear: 2022,
    awardType: '科技进步奖',
    awardLevel: '一等奖',
    completingUnit: '国网新源控股有限公司, 哈尔滨电机厂',
    completers: '黄七, 曹八, 周九',
    source: '中国水力发电工程学会',
  },
  {
    id: 7,
    projectName: '配电网故障智能诊断与自愈控制技术',
    awardYear: 2023,
    awardType: '技术发明奖',
    awardLevel: '二等奖',
    completingUnit: '西安交通大学, 国网陕西省电力公司',
    completers: '林一, 郭二, 何三',
    source: '陕西省科技厅',
  },
  {
    id: 8,
    projectName: '±800kV特高压直流输电换流阀关键技术',
    awardYear: 2022,
    awardType: '科技进步奖',
    awardLevel: '特等奖',
    completingUnit: '中国电力科学研究院, 许继集团有限公司',
    completers: '罗四, 梁五, 宋六, 唐七',
    source: '中国电力企业联合会',
  },
  {
    id: 9,
    projectName: '电力市场运营与监管关键技术研究及应用',
    awardYear: 2024,
    awardType: '标准创新奖',
    awardLevel: '一等奖',
    completingUnit: '北京电力交易中心, 中国电力科学研究院',
    completers: '韩八, 冯九, 褚十',
    source: '国家能源局',
  },
  {
    id: 10,
    projectName: '特高压变压器绝缘结构与制造工艺创新',
    awardYear: 2021,
    awardType: '专利奖',
    awardLevel: '金奖',
    completingUnit: '特变电工股份有限公司, 西安西电变压器公司',
    completers: '卫一, 蒋二, 沈三',
    source: '国家知识产权局',
  },
  {
    id: 11,
    projectName: '综合能源系统多能互补优化调度技术',
    awardYear: 2022,
    awardType: '科技进步奖',
    awardLevel: '二等奖',
    completingUnit: '天津大学, 国网天津市电力公司',
    completers: '魏四, 楚五, 谢六',
    source: '天津市科技局',
  },
  {
    id: 12,
    projectName: '基于人工智能的电力设备状态评估与预测技术',
    awardYear: 2024,
    awardType: '科技进步奖',
    awardLevel: '一等奖',
    completingUnit: '中国电力科学研究院, 华为技术有限公司',
    completers: '彭七, 董八, 苏九',
    source: '国家电网科技部',
  },
];
