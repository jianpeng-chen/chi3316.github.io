---
title: "为Rocketmq增加集成测试流水线"
description: "为 Apache RocketMQ 增加集成测试流水线并处理稳定性问题的实践。"
publishedAt: "2024-08-22T03:28:27.000Z"
updatedAt: "2024-08-22T04:52:07.082Z"
tags: ["开源","CI/CD"]
featured: false
draft: false
legacyPath: "/2024/08/22/为Rocketmq增加集成测试流水线/"
---
## 1、项目要求

[项目描述](https://summer-ospp.ac.cn/org/prodetail/24ee30103?list=org&navpage=org)

Apache RocketMQ 当前有一些测试流水线，包括 单测、e2e 测试等，可以参考
[https://github.com/apache/rocketmq/tree/develop/.github/workflows](https://github.com/apache/rocketmq/tree/develop/.github/workflows)
这些流水线保障 Apache RocketMQ 的代码质量，但仍然存在一些优化的内容：

-   流水线运行不稳定，需要手动重试：一些单元测试不稳定，导致流水线运行失败，需要手动重试。针对上述问题，需要提升单测的稳定性，此外，如果运行失败，可以进行有限次数的重试，减少人为介入。
-   缺失集成测试流水线：RocketMQ 测试流水线会跑 RocketMQ 单测，但当前流水线未运行集成测试（RocketMQ test 模块），需要增加集成测试流水线，同时不影响流水线运行的整体效率（单测流水线和集成测试流水线可以并行运行）。
-   缺少性能基准测试流水线：一些代码的合入可能会影响性，需要性能测试流水线，在同一个性能基准下，衡量不同代码版本间的性能差距。性能的衡量指标包括 TPS 和 RT 等

## 2、前置知识

### 2.1、单元测试与集成测试的区别

### 2.2、Maven中与集成测试相关知识

### 2.3、当前仓库中关于单元测试与集成测试的配置

本地执行集成测试：

-   增加一个profile调过单元测试`-Pskip-unit-tests`
-   运行集成测试：`mvn clean verify -Pit-test -Pskip-unit-tests`

## 3、项目具体实现
