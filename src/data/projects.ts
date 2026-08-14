export type Project = {
  slug: string;
  index: string;
  title: string;
  eyebrow: string;
  summary: string;
  status: string;
  year: string;
  accent: 'cyan' | 'lime' | 'violet';
  stack: string[];
  challenge: string;
  approach: string[];
  impact: string[];
};

export const projects: Project[] = [
  {
    slug: 'ai-advertising-workbench',
    index: '01',
    title: 'AIGC 广告创意生产工具链',
    eyebrow: 'AI WORKFLOW · GAME ADVERTISING',
    summary: '把脚本生成、素材生产、混剪与自动化能力串成面向投放场景的创意工作流。',
    status: 'PROJECT EXPERIENCE',
    year: '2026',
    accent: 'cyan',
    stack: ['LLM', 'Prompt Engineering', 'Video Pipeline', 'RPA'],
    challenge: '创意生产跨越脚本、素材、视频与人工操作，链路长、上下文容易断裂，单点生成能力难以直接形成业务效率。',
    approach: [
      '围绕投放创意的真实生产流程拆分任务，而不是从模型能力反推产品功能。',
      '设计脚本生成与素材生产之间的结构化交付格式，降低环节之间的信息损失。',
      '将混剪、数据采集和重复操作纳入自动化工具链，保留人工审核节点。',
    ],
    impact: [
      '形成从内容构思到素材产出的端到端工程视角。',
      '沉淀了面向业务流程设计 Agent、Prompt 与自动化工具的实践经验。',
      '建立对广告投放创意、数据反馈和生产效率之间关系的理解。',
    ],
  },
  {
    slug: 'ad-data-ai-assistant',
    index: '02',
    title: '投放数据与企业 AI 助手',
    eyebrow: 'AI APPLICATION · DATA PLATFORM',
    summary: '围绕数据平台、BI 与投放分析场景，探索可信、可追溯的企业智能应用。',
    status: 'CURRENT FOCUS',
    year: 'NOW',
    accent: 'lime',
    stack: ['Agent', 'Data Platform', 'BI', 'Attribution'],
    challenge: '企业数据分散在多套系统中，业务问题需要同时理解指标口径、投放语境与权限边界，单纯的自然语言问答不足以交付可靠结果。',
    approach: [
      '以数据口径和可追溯查询链路为基础设计 AI 助手能力。',
      '将投放分析、归因和 BI 工作流拆成可验证的工具调用与任务节点。',
      '在交互体验、工程可靠性和企业数据安全之间做系统权衡。',
    ],
    impact: [
      '持续积累企业 AI 应用从原型到生产落地的方法。',
      '把 Agent 能力与数据中台场景结合，而不是停留在通用聊天界面。',
      '形成 AI Engineering、数据应用与业务理解的交叉能力。',
    ],
  },
  {
    slug: 'rocketmq-chaos-infrastructure',
    index: '03',
    title: 'RocketMQ 自动化混沌测试基础设施',
    eyebrow: 'OPEN SOURCE · RELIABILITY ENGINEERING',
    summary: '为 Apache RocketMQ 构建自动化 Chaos 测试能力，提升测试流水线的稳定性与可维护性。',
    status: 'OSPP 2024',
    year: '2024',
    accent: 'violet',
    stack: ['Java', 'RocketMQ', 'Kubernetes', 'GitHub Actions'],
    challenge: '分布式消息系统需要覆盖复杂故障场景，而现有测试流程存在不稳定、人工介入和复现成本高等问题。',
    approach: [
      '梳理故障注入、环境编排、断言与恢复的完整测试生命周期。',
      '基于容器与自动化流水线组织可重复执行的混沌测试任务。',
      '在开源社区协作中持续处理依赖、CI 和跨环境兼容问题。',
    ],
    impact: [
      '完成自动化混沌测试框架的设计与实现。',
      '积累分布式系统可靠性、CI/CD 与开源协作经验。',
      '将一次性测试脚本沉淀为可复用的工程基础设施。',
    ],
  },
];
