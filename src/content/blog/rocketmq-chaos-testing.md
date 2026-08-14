---
title: "自动化混沌测试框架的设计与实现"
description: "为 Apache RocketMQ 设计自动化 Chaos 测试基础设施的过程与思考。"
publishedAt: "2024-08-22T03:34:04.000Z"
updatedAt: "2024-11-14T11:24:27.511Z"
tags: ["开源","可靠性工程"]
featured: true
draft: false
legacyPath: "/2024/08/22/自动化混沌测试框架的设计与实现/"
---
回顾总结一下OSPP2024中做的项目：搭建自动化 RocketMQ Chaos 测试基础设施，并提升 Apache RocketMQ 测试流水线质量

## 1\. 技术选型

### 1.1 OpenChaos

OpenChaos 是openmessage组织下开源的一款混沌测试框架。其主要目标是通过模拟各种故障场景，验证消息系统在高并发和故障条件下的稳定性和可靠性。OpenChaos 提供了一些预定义的测试模型，能够检测系统在网络延迟、网络分区、节点崩溃等情况下的行为。

#### 1.1.1 工作原理

OpenChaos的架构图如下：

![image-20240518094127370](/assets/image-20240518094127370.png)

整体架构可以分为管理层、执行层与被测组件层。

-   管理层负责整个测试流程的控制，确保测试的各个步骤按预定顺序进行。
-   中间的执行层是OpenChaos的核心组件，Model定义了对分布式系统进行操作的基本形式，包括测试步骤和方法；Detection Model用来给系统注入故障模型；Metrics和Measurement Model负责监测被测集群的表现和根据测试结果生成可视化图表。
-   被测组件层指的是待测试的分布式系统，可以通过实现OpenChaos的API接入驱动。

OpenChaos 的工作原理是：

1.  控制节点负责管理整个测试流程，将集群节点组成待测试的分布式集群，并根据需要测试的系统找到并加载对应的 Driver 组件，创建相应数量的客户端。
2.  控制节点按照Model 组件定义的流程，指挥客户端对集群进行操作。
3.  在测试过程中，Detection Model 会根据不同的观察需求在集群节点上引入故障或事件。
4.  Metrics 模块则监测集群的表现，收集性能数据。
5.  测试结束后，检查器组件自动分析业务和非业务数据，生成测试结果并以可视化图表的形式展示。

#### 1.1.2 消息检测模型（QueueModel）

OpenChaos提供了对分布式系统进行混沌测试的基础框架，可以有效的检测分布式集群在各种边缘故障环境下的韧性表现。它提供的消息检测模型可以很好地检测分布式消息系统的表现。完成本项目需要对OpenChaso提供的消息检测模型有足够深入的了解。通过阅读OpenChaos的源码可以初步认识该消息检测模型：

在`chaos-framework/src/main/java/io/openchaos/model`包下的 `Model` 接口定义了 OpenChaos 中检测模型的核心操作和方法，提供了管理测试集群和执行测试的基本功能。该接口的方法及其作用如下：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br><span class="line">22</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">public</span> <span class="keyword">interface</span> <span class="title class_">Model</span> <span class="keyword">extends</span> <span class="title class_">MetaDataSupport</span> {</span><br><span class="line">    <span class="comment">// 设置所有客户端(client节点),包括初始化客户端实例并配置它们以便与测试集群进行交互</span></span><br><span class="line">    <span class="keyword">void</span> <span class="title function_">setupClient</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 设置要测试的集群。driverConfiguration : 驱动程序的配置，指定如何配置和管理集群节点</span></span><br><span class="line">    Map&lt;String, ChaosNode&gt; <span class="title function_">setupCluster</span><span class="params">(DriverConfiguration driverConfiguration, <span class="type">boolean</span> isInstall, <span class="type">boolean</span> restart)</span>;</span><br><span class="line">    <span class="comment">// 确保集群已准备就绪</span></span><br><span class="line">    <span class="type">boolean</span> <span class="title function_">probeCluster</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 开始测试，启动测试过程，包括故障注入和性能监控</span></span><br><span class="line">    <span class="keyword">void</span> <span class="title function_">start</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 停止测试</span></span><br><span class="line">    <span class="keyword">void</span> <span class="title function_">stop</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 测试停止后执行的操作,用于清理或收集测试后的数据</span></span><br><span class="line">    <span class="keyword">void</span> <span class="title function_">afterStop</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 关闭模型</span></span><br><span class="line">    <span class="keyword">void</span> <span class="title function_">shutdown</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 获取MetaNode,在RocketMQ指NameServer</span></span><br><span class="line">    String <span class="title function_">getMetaNode</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 获取可以区分集群的名称，在RocketMQ中指clusterName</span></span><br><span class="line">    String <span class="title function_">getMetaName</span><span class="params">()</span>;</span><br><span class="line">    <span class="comment">// 获取状态类的类名</span></span><br><span class="line">    String <span class="title function_">getStateName</span><span class="params">()</span>;</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

其中针对消息系统的检测模型是`QueueModel`，它是 `Model` 接口的一个实现类，用于测试消息队列系统的可靠性和稳定性。它具体实现了 `Model` 接口中定义的方法，并且添加了很多与消息队列相关的特定功能。

其构造函数和一些重要的成员变量如下：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">public</span> <span class="title function_">QueueModel</span><span class="params">(<span class="type">int</span> concurrency, RateLimiter rateLimiter, Recorder recorder, File driverConfigFile,</span></span><br><span class="line"><span class="params">    <span class="type">boolean</span> isOrderTest, <span class="type">boolean</span> isUsePull, List&lt;String&gt; shardingKeys)</span> {</span><br><span class="line">    <span class="built_in">this</span>.concurrency = concurrency; <span class="comment">// 并发数，决定同时运行的客户端数量</span></span><br><span class="line">    <span class="built_in">this</span>.recorder = recorder; <span class="comment">// 记录器，记录请求/响应的数据</span></span><br><span class="line">    <span class="built_in">this</span>.driverConfigFile = driverConfigFile; <span class="comment">// 驱动的配置文件</span></span><br><span class="line">    <span class="built_in">this</span>.rateLimiter = rateLimiter;</span><br><span class="line">    clients = <span class="keyword">new</span> <span class="title class_">ArrayList</span>&lt;&gt;(); <span class="comment">// 存储客户端线程的列表</span></span><br><span class="line">    workers = <span class="keyword">new</span> <span class="title class_">ArrayList</span>&lt;&gt;(); <span class="comment">// 工作线程列表</span></span><br><span class="line">    cluster = <span class="keyword">new</span> <span class="title class_">HashMap</span>&lt;&gt;();</span><br><span class="line">    metaNodesMap = <span class="keyword">new</span> <span class="title class_">HashMap</span>&lt;&gt;();</span><br><span class="line">    chaosTopic = String.format(<span class="string">"%s-chaos-topic"</span>, DATE_FORMAT.format(<span class="keyword">new</span> <span class="title class_">Date</span>()));</span><br><span class="line">    <span class="built_in">this</span>.isOrderTest = isOrderTest; <span class="comment">// 是否进行有序测试</span></span><br><span class="line">    <span class="built_in">this</span>.isUsePull = isUsePull; <span class="comment">// 是否使用拉取模式</span></span><br><span class="line">    <span class="built_in">this</span>.shardingKeys = shardingKeys;</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

**QueueModel在设置完集群setupCluster()和客户端setupClient()之后，通过start()启动：**

对于消息系统，会启动所有的`QueueClient`的工作线程，负责消息的生产和消费操作。它的`nextInvoke()`方法负责向群集发出请求,根据生成的操作进行相应的生产或消费操作，并记录请求和响应日志。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br><span class="line">22</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">nextInvoke</span><span class="params">()</span> {</span><br><span class="line">    <span class="comment">// ...</span></span><br><span class="line">    <span class="keyword">if</span> (op.getInvokeOperation().equals(<span class="string">"enqueue"</span>)) {</span><br><span class="line">        <span class="comment">// 生产操作 </span></span><br><span class="line">        InvokeResult invokeResult;</span><br><span class="line">        <span class="keyword">if</span> (isOrderTest) {</span><br><span class="line">            <span class="comment">// 顺序测试时，选择分片键并记录请求和响应日志</span></span><br><span class="line">            <span class="type">String</span> <span class="variable">shardingKey</span> <span class="operator">=</span> shardingKeys.get(random.nextInt(shardingKeys.size()));</span><br><span class="line">            requestLogEntry.shardingKey = shardingKey;</span><br><span class="line">            recorder.recordRequest(requestLogEntry);</span><br><span class="line">            invokeResult = producer.enqueue(shardingKey, op.getValue().getBytes());</span><br><span class="line">            recorder.recordResponse(<span class="keyword">new</span> <span class="title class_">ResponseLogEntry</span>(clientId, op.getInvokeOperation(),</span><br><span class="line">                invokeResult, shardingKey, op.getValue(), System.currentTimeMillis(), System.currentTimeMillis() - requestLogEntry.timestamp, invokeResult.getExtraInfo()));</span><br><span class="line">        } <span class="keyword">else</span> {</span><br><span class="line">            <span class="comment">// 非顺序测试时，直接记录请求和响应日志</span></span><br><span class="line">            <span class="comment">// ...</span></span><br><span class="line">        }</span><br><span class="line">    } <span class="keyword">else</span> {</span><br><span class="line">        <span class="comment">// ...</span></span><br><span class="line">        <span class="comment">// 消费操作，调用 dequeue 方法，记录响应日志</span></span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

**stop()停止测试，并在测试结束后执行客户端的最后一次调用：**

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">afterStop</span><span class="params">()</span> {</span><br><span class="line">        clients.forEach(Client::lastInvoke); <span class="comment">// 如果Queue在usePull模式下，lastInvoke会通过循环拉取和记录(drain)消息，确保所有剩余消息都得到处理</span></span><br><span class="line">    }</span><br></pre></td></tr></tbody></table>

**最后，关闭客户端和集群节点。**

以下是 `QueueModel` 进行消息系统测试的流程图：

![Untitled diagram-2024-11-14-111418](/assets/mermaid1.png)

OpenChaos提供的消息检测模型可以在各种故障场景下有效地检测消息系统的关键指标：

-   消息丢失检测：确保在各种故障场景下，消息不会丢失。
-   可用性检测：确保系统在故障发生时仍然具有预期的可用性。
-   消息顺序性验证：检测消息系统在故障场景下是否能维持消息顺序的正确性。

这一模型在确保消息系统的可靠性和稳定性方面具有很高的借鉴价值。在本项目中需要对OpenChaos的消息检测模型有比较深刻的认识之后，再利用这一模型结合Chaos Mesh等混沌测试平台对RocketMQ集群进行测试。

### 1.2 Chaos Mesh

#### 1.2.1 原理简介

Chaos Mesh是一个基于Kubernetes的云原生混沌工程平台，内置了丰富的故障模拟类型，可以很方便地在开发测试中以及生产环境中模拟系统在现实世界中可能出现的各类异常，及时发现系统潜在的问题。

Chaos Mesh基于 Kubernetes CRD (Custom Resource Definition) 构建。其工作原理可以简要概述为：

1.  **故障类型对应Kubernetes的CRD**：将不同的故障类型定义为多个CRD类型。这些CRD类型包括网络故障、节点故障、磁盘故障等。用户可以通过创建相应的CRD对象来描述和配置具体的故障模拟实验。
2.  **每种故障类型由单独的Controller控制**：每种故障类型实现了单独的Controller，这些Controller负责监听和处理对应CRD对象的变更事件，根据用户的配置启动、停止或调整相应的混沌实验。
3.  **执行混沌实验**：当用户创建或更新CRD对象时，对应的Controller会根据CRD对象中的配置信息启动相应的混沌实验，在Kubernetes集群中模拟各种故障和异常条件。
4.  **测试结果分析：**在混沌实验执行完成后，Chaos Mesh根据测试的数据评估系统在面对各种异常情况时的表现。

#### 1.2.2 定义混沌实验并进行故障注入

通过对Chaos Mesh原理而简要分析之后，可知使用Chaos Mesh进行混沌测试的**关键在于如何定义混沌实验的类型并将故障注入到待测试的系统中**。在学习了Chaos Mesh的文档和运行demo示例之后，我对Chaos Mesh的使用有了初步的认识：

![image-20240518113553345](/assets/image-20240518113553345.png)

**定义混沌实验：**

在Chaos Mesh中可以通过编写对应 YAML 文件或者在Dashboard上操作这两种方式定义混沌实验，很明显编写YAML的方式更符合本项目的需求。在定义混沌实验时，可以通过`selector`指定实验作用的范围，还可以通过创建不同的`Schedule`对象来定义实验的调度规则，比如可以使用cron表达式作为`schedule`字段的值来执行定时任务，从而在固定的时间（或根据固定的时间间隔）自动新建混沌实验。

下面是一个混沌实验（名为`network-delay.yaml`的文件）的定义示例：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br><span class="line">22</span><br></pre></td><td class="code"><pre><span class="line"><span class="attr">apiVersion:</span> <span class="string">chaos-mesh.org/v1alpha1</span></span><br><span class="line"><span class="attr">kind:</span> <span class="string">Schedule</span></span><br><span class="line"><span class="attr">metadata:</span></span><br><span class="line">  <span class="attr">name:</span> <span class="string">schedule-delay-example</span></span><br><span class="line"><span class="attr">spec:</span></span><br><span class="line">  <span class="attr">schedule:</span> <span class="string">'5 * * * *'</span></span><br><span class="line">  <span class="attr">historyLimit:</span> <span class="number">2</span></span><br><span class="line">  <span class="attr">concurrencyPolicy:</span> <span class="string">'Allow'</span></span><br><span class="line">  <span class="attr">type:</span> <span class="string">'NetworkChaos'</span></span><br><span class="line">  <span class="attr">networkChaos:</span></span><br><span class="line">    <span class="attr">action:</span> <span class="string">delay</span></span><br><span class="line">    <span class="attr">mode:</span> <span class="string">one</span></span><br><span class="line">    <span class="attr">selector:</span></span><br><span class="line">      <span class="attr">namespaces:</span></span><br><span class="line">        <span class="bullet">-</span> <span class="string">default</span></span><br><span class="line">      <span class="attr">labelSelectors:</span></span><br><span class="line">        <span class="attr">'app':</span> <span class="string">'web-show'</span></span><br><span class="line">    <span class="attr">delay:</span></span><br><span class="line">      <span class="attr">latency:</span> <span class="string">'10ms'</span></span><br><span class="line">      <span class="attr">correlation:</span> <span class="string">'100'</span></span><br><span class="line">      <span class="attr">jitter:</span> <span class="string">'0ms'</span></span><br><span class="line">    <span class="attr">duration:</span> <span class="string">'12s'</span></span><br></pre></td></tr></tbody></table>

依据此配置，Chaos Mesh 将会在每个小时的第五分钟（比如 `0:05`, `1:05`…）创建 `NetworkChaos` 对象。

**运行实验，将故障注入系统：**

定义完混沌实验的类型之后，仍以上面的`network-delay.yaml`举例，使用`kubectl apply -f`创建并运行该指令：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl apply -f network-delay.yaml</span><br></pre></td></tr></tbody></table>

使用 `kubectl describe` 命令检查混沌实验的运行情况：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl describe networkchaos network-delay</span><br></pre></td></tr></tbody></table>

结束混沌实验后，使用 `kubectl delete` 命令删除混沌实验：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl delete networkchaos network-delay</span><br></pre></td></tr></tbody></table>

#### 1.2.3 OpenChaos的消息检测模型与Chaos Mesh的结合

经过前面的调研，可以认识到Chaos Mesh和OpenChaos的定位是不太相同的，**Chaos Mesh主要提供比较完整的混沌实验故障注入的手段，而OpenChaos则是需要针对某些类型中间件做固定Module运行**。而本项目是针对RocketMQ集群进行测试，利用OpenChaos提供的队列模型对消息系统的消息语义进行验证，并结合Chaos Mesh测试平台在Kubernetes环境下方便部署的特性来为RocketMQ构建自动化的测试框架是一套更为准确的方案。

但是按照OpenChaos的使用方法来搭建测试环境需要一些准备工作和手动配置，是比较繁琐的。为了在Kubernetes环境下更方便地部署和管理这个测试框架，可以考虑将OpenChaos配置和运行脚本容器化，部署到Kubernetes中，这样能够简化其部署流程，使其能够在Kubernetes集群中自动化地运行消息系统测试。结合Chaos Mesh，可以在同一环境中注入各种故障，模拟真实的生产环境，从而更加全面和准确地验证RocketMQ的稳定性和容错性。

可以用下图概括：

![image-20240519112016197](/assets/image-20240519112016197.png)

### 2\. 搭建自动化 RocketMQ Chaos 测试基础设施

通过对项目的调研，对于为RocketMQ搭建一个自动化Chaos测试框架有了一个初步的实现方案：在 Kubernetes 环境中搭建起RocketMQ集群，并将OpenChaos容器化并运行在同一个Kubernetes 环境中对 RocketMQ 集群进行消息语义验证，并结合 Chaos Mesh 进行故障注入，最后收集测试数据并分析结果。编写自动化脚本执行这一测试流程。最终将该框架集成到 GitHub CI 中，实现持续集成测试。

框架的总体设计包括以下几个部分：

1.  RocketMQ集群部署：在Kubernetes中部署并运行RocketMQ集群。
2.  OpenChaos测试容器化：将OpenChaos的测试部分容器化，简化其部署和运行。
3.  Chaos Mesh故障注入：利用Chaos Mesh注入故障，实现对RocketMQ集群的各种故障模拟。
4.  Kubernetes编排：通过Kubernetes编排测试和故障注入，自动化执行测试流程。

以下是详细流程图，展示了框架的工作流程：

![image-20240519112016197](/assets/mermaid2.png)

**关键步骤：**

1.  环境准备：
    -   安装Kubernetes集群，Chaos Mesh，准备RocketMQ集群的部署配置。
    -   编辑OpenChaos的配置文件`rocketmq.yaml`，配置RocketMQ的相关信息。
2.  使用Helm搭建起RocketMQ集群 ： [https://github.com/apache/rocketmq-docker/tree/master/rocketmq-k8s-helm](https://github.com/apache/rocketmq-docker/tree/master/rocketmq-k8s-helm)
3.  创建Dockerfile，将OpenChaos的测试部分容器化，构建Docker镜像。
4.  创建Kubernetes Job来运行OpenChaos测试容器。
5.  创建Chaos Mesh CRD，进行故障注入。
6.  执行测试：
    -   确保RocketMQ集群已经运行。
    -   部署OpenChaos测试Job，开始消息系统的测试。
    -   在测试过程中，通过Chaos Mesh注入故障，监控RocketMQ的行为和OpenChaos的测试结果。
    -   等待OpenChaos测试Job完成，生成测试结果文件。
    -   分析测试结果，生成报告。
7.  清理测试环境，释放资源。

最后可以集成到GitHub Actions中，实现自动化部署和测试流程。
