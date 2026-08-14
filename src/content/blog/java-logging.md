---
title: "java日志库"
description: "Java 日志库的选型、核心概念与基本用法总结。"
publishedAt: "2024-04-12T02:35:25.000Z"
updatedAt: "2024-04-18T08:46:45.856Z"
tags: ["Java"]
featured: false
draft: false
legacyPath: "/2024/04/12/java日志库/"
---
总结一下java日志库的相关知识以及日志库的选型和基本用法

## 初始：一个日志库的使用例子

通过一个使用log4j2 + slf4j的案例初步认识日志库的使用：

1.  创建pom项目，引入相关依赖：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br></pre></td><td class="code"><pre><span class="line"><span class="comment">&lt;!-- SLF4J API --&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>slf4j-api<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.32<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br><span class="line"><span class="comment">&lt;!-- SLF4J binding for Log4j 2 --&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.apache.logging.log4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>log4j-slf4j-impl<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>2.17.1<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br><span class="line"><span class="comment">&lt;!-- Log4j 2 implementation --&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.apache.logging.log4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>log4j-core<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>2.17.1<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

2.  在项目中配置 Log4j 2 的日志记录器。创建一个 `log4j2.xml` 文件来配置日志记录器。

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br></pre></td><td class="code"><pre><span class="line"><span class="meta">&lt;?xml version=<span class="string">"1.0"</span> encoding=<span class="string">"UTF-8"</span>?&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">Configuration</span> <span class="attr">status</span>=<span class="string">"WARN"</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">Appenders</span>&gt;</span></span><br><span class="line">        <span class="tag">&lt;<span class="name">Console</span> <span class="attr">name</span>=<span class="string">"Console"</span> <span class="attr">target</span>=<span class="string">"SYSTEM_OUT"</span>&gt;</span></span><br><span class="line">            <span class="tag">&lt;<span class="name">PatternLayout</span> <span class="attr">pattern</span>=<span class="string">"%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"</span>/&gt;</span></span><br><span class="line">        <span class="tag">&lt;/<span class="name">Console</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;/<span class="name">Appenders</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">Loggers</span>&gt;</span></span><br><span class="line">        <span class="tag">&lt;<span class="name">Root</span> <span class="attr">level</span>=<span class="string">"debug"</span>&gt;</span></span><br><span class="line">            <span class="tag">&lt;<span class="name">AppenderRef</span> <span class="attr">ref</span>=<span class="string">"Console"</span>/&gt;</span></span><br><span class="line">        <span class="tag">&lt;/<span class="name">Root</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;/<span class="name">Loggers</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">Configuration</span>&gt;</span></span><br><span class="line"></span><br></pre></td></tr></tbody></table>

3.  在代码中使用 SLF4J API 进行日志记录

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">package</span> org.example;</span><br><span class="line"></span><br><span class="line"><span class="keyword">import</span> com.sun.tools.javac.Main;</span><br><span class="line"><span class="keyword">import</span> org.slf4j.Logger;</span><br><span class="line"><span class="keyword">import</span> org.slf4j.LoggerFactory;</span><br><span class="line"><span class="keyword">public</span> <span class="keyword">class</span> <span class="title class_">App</span> {</span><br><span class="line">    <span class="keyword">private</span> <span class="keyword">static</span> <span class="keyword">final</span> <span class="type">Logger</span> <span class="variable">logger</span> <span class="operator">=</span> LoggerFactory.getLogger(Main.class);</span><br><span class="line"></span><br><span class="line">    <span class="keyword">public</span> <span class="keyword">static</span> <span class="keyword">void</span> <span class="title function_">main</span><span class="params">(String[] args)</span> {</span><br><span class="line">        logger.info(<span class="string">"This is an info message"</span>);</span><br><span class="line">        logger.error(<span class="string">"This is an error message"</span>, <span class="keyword">new</span> <span class="title class_">RuntimeException</span>(<span class="string">"Oops! Something went wrong."</span>));</span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

4.  查看日志输出

    ![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/image-20240412105557104.png)

    ![](/assets/image-20240412105557104.png)


在这个案例中，使用了slf4j的api进行日志输出，log4j2负责在程序运行时生成并记录日志，而程序开发人员使用slf4j提供的api来指定日志的记录。

在引入依赖时，分别引入了slf4j的api ： `slf4j-api`、log4j2的日志功能的实现：`log4j-core`，以及选择`log4j-slf4j-impl`作为slf4j和log4j2的桥接包，让slf4j 与实现日志功能的log4j绑定。这样就可以使用slf4j的api调用log4j2提供的日志功能。这种设计模式成为门面模式（Facade Pattern 可参考：[https://www.runoob.com/w3cnote/facade-pattern-3.html）。](https://www.runoob.com/w3cnote/facade-pattern-3.html%EF%BC%89%E3%80%82)

在 Java 中，日志库通常使用门面模式来提供统一的接口，以便开发人员可以方便地切换不同的日志实现，而不必修改应用程序的代码。门面模式隐藏了底层组件的复杂性，并提供了一个简单的接口供客户端使用。

SLF4J（Simple Logging Facade for Java）是一个典型的例子，它就是使用了门面模式。SLF4J 提供了一个简单的抽象接口，开发人员可以在应用程序中使用这个接口来记录日志，而不用关心底层日志库的具体实现。然后，通过在类路径中引入相应的日志实现（如Log4j、Logback等），SLF4J 会自动找到并绑定到这些实现，从而实现日志记录功能。

## 日志库 — 日志门面

在 Java 中，有几个常见的日志门面框架，它们为开发人员提供了统一的日志记录接口，使得在应用程序中记录日志变得更加灵活和可移植.

### SLF4J (Simple Logging Facade for Java)

SLF4J 是一个简单的日志门面框架，它允许开发人员在应用程序中使用统一的 API 来记录日志。SLF4J 提供了一组接口，开发人员可以使用这些接口来记录日志消息，而不用关心底层日志库的具体实现。SLF4J 还提供了与不同日志实现（如Log4j、Logback等）集成的机制，通过引入相应的日志实现，可以将 SLF4J 绑定到具体的日志库上。

类似于 Common-Logging，slf4j 是对不同日志框架提供的一个 API 封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。但是，slf4j 在编译时静态绑定真正的 Log 库。使用 SLF4J 时，如果你需要使用某一种日志实现，那么你必须选择正确的 SLF4J 的 jar 包的集合（各种桥接包）。

> 使用SLF4j的过程中遇到的各种警告可以去[https://www.slf4j.org/codes.html](https://www.slf4j.org/codes.html) 里查看问题描述，基本都有解答。

![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/dev-package-log-6.png)

**使用 SLF4J 的主要步骤**：

1.  添加 SLF4J 依赖: 在项目的构建文件中（如 Maven 的 `pom.xml` 文件）添加 SLF4J 的依赖。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>slf4j-api<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.32<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

2.  引入日志实现: SLF4J 是一个日志门面，它本身并不提供日志记录的实现，需要引入具体的日志实现。例如，可以引入 Logback 作为日志实现。(Logback 提供了自己的实现，并在其中包含了 SLF4J 的 API。因此不需要额外引入桥接器来使 SLF4J 与 Logback 集成，只需添加 logback-classic 依赖即可)

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>ch.qos.logback<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>logback-classic<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.2.6<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

3.  在代码中使用 SLF4J API 进行日志记录：

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br></pre></td><td class="code"><pre><span class="line">javaCopy codeimport org.slf4j.Logger;</span><br><span class="line"><span class="keyword">import</span> org.slf4j.LoggerFactory;</span><br><span class="line"></span><br><span class="line"><span class="keyword">public</span> <span class="keyword">class</span> <span class="title class_">MyClass</span> {</span><br><span class="line">    <span class="keyword">private</span> <span class="keyword">static</span> <span class="keyword">final</span> <span class="type">Logger</span> <span class="variable">logger</span> <span class="operator">=</span> LoggerFactory.getLogger(MyClass.class);</span><br><span class="line"></span><br><span class="line">    <span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">myMethod</span><span class="params">()</span> {</span><br><span class="line">        logger.debug(<span class="string">"Debug message"</span>);</span><br><span class="line">        logger.info(<span class="string">"Info message"</span>);</span><br><span class="line">        logger.warn(<span class="string">"Warning message"</span>);</span><br><span class="line">        logger.error(<span class="string">"Error message"</span>);</span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

### Apache Commons Logging (JCL)

Apache Commons Logging 是另一个常见的日志门面框架，它提供了一个简单的接口，允许开发人员在应用程序中记录日志消息。JCL 具有类似于 SLF4J 的功能，但它的设计更加简单，没有 SLF4J 那么灵活和强大。

JCL本身并不提供日志的具体实现（当然，common-logging 内部有一个 Simple logger 的简单实现，但是功能很弱，直接忽略），而是在运行时动态的绑定日志实现组件来工作（如 log4j、java.util.loggin）。

与 SLF4J 不同的是，JCL 并没有像 SLF4J 那样支持多种日志实现，而是将日志记录的实现交由第三方提供。

**使用 Apache Commons Logging 的主要步骤**：

1.  添加 Apache Commons Logging 依赖: 在项目的构建文件中（如 Maven 的 `pom.xml` 文件）添加 Apache Commons Logging 的依赖。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>commons-logging<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>commons-logging<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.2<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

2.  引入日志实现: 与 SLF4J 不同，Apache Commons Logging 并不要求引入特定的日志实现。开发人员可以根据需求选择任何支持 Apache Commons Logging 的日志实现，如 Log4j、Logback 等。

3.  在代码中使用 Apache Commons Logging API 进行日志记录：


<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">import</span> org.apache.commons.logging.Log;</span><br><span class="line"><span class="keyword">import</span> org.apache.commons.logging.LogFactory;</span><br><span class="line"></span><br><span class="line"><span class="keyword">public</span> <span class="keyword">class</span> <span class="title class_">MyClass</span> {</span><br><span class="line">    <span class="keyword">private</span> <span class="keyword">static</span> <span class="keyword">final</span> <span class="type">Log</span> <span class="variable">logger</span> <span class="operator">=</span> LogFactory.getLog(MyClass.class);</span><br><span class="line"></span><br><span class="line">    <span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">myMethod</span><span class="params">()</span> {</span><br><span class="line">        logger.debug(<span class="string">"Debug message"</span>);</span><br><span class="line">        logger.info(<span class="string">"Info message"</span>);</span><br><span class="line">        logger.warn(<span class="string">"Warning message"</span>);</span><br><span class="line">        logger.error(<span class="string">"Error message"</span>);</span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

> 需要注意的是，在使用 Apache Commons Logging 时，需要确保项目的类路径中包含了选定的日志实现（如 Log4j、Logback），否则无法正常记录日志。

## 日志库 — 日志实现

日志实现库提供了用于记录应用程序日志的具体实现。这些库通常与日志门面框架（如SLF4J或Apache Commons Logging）配合使用，以提供统一的日志记录接口，并允许开发人员根据需要选择适当的日志实现。

### Log4j 1.x

Log4j 是 apache 的一个开源项目，创始人 Ceki Gulcu。它提供了成熟的日志记录功能，是 Java 领域资格最老，应用最广的日志工具。Log4j 是高度可配置的，并可通过在运行时的外部文件配置。它根据记录的优先级别，并提供机制，以指示记录信息到许多的目的地，诸如：数据库，文件，控制台，UNIX 系统日志等。

**Log4j 中有三个主要组成部分：**

-   loggers - 负责捕获记录信息。
-   appenders - 负责发布日志信息，以不同的首选目的地。
-   layouts - 负责格式化不同风格的日志信息。

**优点：**

-   **成熟稳定**: Log4j 1.x 是一个成熟的日志框架，在很长一段时间内被广泛应用和验证。
-   **功能丰富**: 提供了丰富的功能和配置选项，适用于各种日志需求。

**缺点：**

-   **性能不如后续版本**: 相比于 Log4j 2 和 Logback，性能略逊一筹。
-   **维护状态**: Log4j 1.x 的维护状态已经停止，不再推荐新项目使用

**使用方法：**

1.  添加 Log4j 1.x 的依赖到项目中。
2.  创建 `log4j.properties` 或 `log4j.xml` 配置文件，配置日志记录器、输出目标等。
3.  在代码中使用 Log4j 1.x 的 API 进行日志记录。

### Log4j 2

维护 Log4j 的人为了性能又搞出了 Log4j2。Log4j2 和 Log4j1.x 并不兼容，设计上很大程度上模仿了 SLF4J/Logback，提供了异步日志记录、插件架构、灵活的配置选项等特性，被广泛用于 Java 应用程序的日志记录，性能上也获得了很大的提升。

Log4j2 也做了 Facade/Implementation 分离的设计，分成了 log4j-api 和 log4j-core。

**优点：**

-   高性能: Log4j 2 针对性能进行了优化，特别是在异步日志记录方面，可以提供较高的吞吐量。
-   灵活的配置: Log4j 2 提供了丰富的配置选项，允许开发人员通过 XML、JSON、YAML 或编程方式配置日志记录器。
-   插件架构: Log4j 2 使用插件架构，可以轻松地扩展功能，添加新的日志输出目标、格式化器等。
-   支持多种日志级别: 支持调试、信息、警告、错误、致命等多种日志级别。
-   与 SLF4J 集成: 可以与 SLF4J 集成，使得在应用程序中记录日志更加灵活和可移植。

**缺点：**

-   配置相对复杂: 配置文件的格式较为复杂，需要一定的学习成本。
-   资源占用较高: 相对于其他日志库，可能会占用较多的资源。

**使用方法：**

1.  添加 Log4j 2 的依赖到项目中。
2.  创建 `log4j2.xml` 或 `log4j2.yaml` 等配置文件，配置日志记录器、输出目标等。
3.  在代码中使用 SLF4J 或 Log4j 2 的 API 进行日志记录。

### Logback

Logback 是由 Log4j 的作者开发的日志框架，被设计成 Log4j 的改进版。它具有与 Log4j 相似的功能，但在性能上有所提升。Logback 提供了异步日志记录、灵活的配置选项等特性，同时与 SLF4J 集成，使得在应用程序中记录日志变得更加灵活和可移植。

**logback 当前分成三个模块：logback-core、logback-classic 和 logback-access。**

-   logback-core ：是其它两个模块的基础模块。
-   logback-classic ：是 log4j 的一个 改良版本。此外 logback-classic 完整实现 SLF4J API 使你可以很方便地更换成其它日志系统如 log4j 或 JDK14 Logging。
-   logback-access ： 访问模块与 Servlet 容器集成提供通过 Http 来访问日志的功能。

**优点：**

-   性能优秀: Logback 是 Log4j 的改进版，性能较好，特别是在并发环境中表现突出。
-   简单配置: Logback 的配置相对简单，易于上手。
-   与 SLF4J 集成: 可以与 SLF4J 集成，提供了统一的日志记录接口。

**缺点：**

-   社区活跃度较低: 相比于 Log4j 2，Logback 的社区活跃度可能稍低。
-   插件数量相对较少: 插件数量不及 Log4j 2 多。

**使用方法：**

1.  添加 Logback 的依赖到项目中。
2.  创建 `logback.xml` 配置文件，配置日志输出目标、格式化器等。
3.  在代码中使用 SLF4J 或 Logback 的 API 进行日志记录。

### java.util.logging (JUL)

JUL是 Java 平台自带的日志框架，也称为 JDK 日志框架。它提供了基本的日志功能，包括日志记录器、日志处理器、日志格式化器等，可以在大多数 Java 应用程序中直接使用，而无需额外的依赖。

虽然是官方自带的log lib，JUL的使用确不广泛。原因有以下几点：

-   JUL从JDK1.4 才开始加入(2002年)，当时各种第三方log lib已经被广泛使用了

-   JUL早期存在性能问题，到JDK1.5上才有了不错的进步，但现在和Logback/Log4j2相比还是有所不如

-   JUL的功能不如Logback/Log4j2等完善，比如Output Handler就没有Logback/Log4j2的丰富，有时候需要自己来继承定制，又比如默认没有从ClassPath里加载配置文件的功能


**使用方法：**

1.  在代码中直接使用 `java.util.logging` 包中的类进行日志记录。
2.  可以通过配置文件或代码配置日志记录器、处理器等。

## 日志库的选型与具体使用

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)

使用日志库通常涉及3个基本步骤：

1.  引入对应的依赖
2.  配置日志实现组件
3.  使用API

重点在于引入依赖，因为配置和api的使用不同的日志门面和日志实现基本相同。

### 正确引入对应的依赖

1.  使用`logback + slf4j` 直接引入`logback-classic` 即可

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>ch.qos.logback<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>logback-classic<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.4.11<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">scope</span>&gt;</span>test<span class="tag">&lt;/<span class="name">scope</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

    `logback-classic`会自动将 `slf4j-api` 和 `logback-core`也添加到项目中:

    ![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/image-20240412105557104.png)

2.  slf4j + log4j

    -   直接引入`slf4j-log4j12` 它会一起引入`slf4j-api` 和 `log4j`

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line">&lt;dependency&gt;</span><br><span class="line">  &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span><br><span class="line">  &lt;artifactId&gt;slf4j-log4j12&lt;/artifactId&gt;</span><br><span class="line">  &lt;version&gt;<span class="number">1.7</span><span class="number">.21</span>&lt;/version&gt;</span><br><span class="line">&lt;/dependency&gt;</span><br></pre></td></tr></tbody></table>

        ![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/image-20240416105549891.png)

    -   也可以分别引入`slf4j-api`、`log4j-slf4j-impl`、`log4j-core`，比较麻烦，还要注意版本有没有冲突

3.  slf4j + jul

    直接引入`slf4j-jdk14`，它会自动添加相关依赖

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>slf4j-jdk14<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>2.0.12<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

    ![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/image-20240416110016934.png)


### slf4j兼容非slf4j组件 — 桥接

假如应用程序所调用的组件当中已经使用了 common-logging，这时需要 jcl-over-slf4j.jar 把日志信息输出重定向到 slf4j-api，slf4j-api 再去调用 slf4j 实际依赖的日志组件。这个过程称为桥接。下图是官方的 slf4j 桥接策略图

![](/2024/04/12/java%E6%97%A5%E5%BF%97%E5%BA%93/dev-package-log-5.png)

无论项目中使用的是 common-logging 或是直接使用 log4j、java.util.logging，都可以使用对应的桥接 jar 包来解决兼容问题。

-   slf4j 兼容 common-logging

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>jcl-over-slf4j<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.12<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

-   slf4j 兼容 log4j

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>log4j-over-slf4j<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.12<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

-   slf4j 兼容 java.util.logging

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>jul-to-slf4j<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.12<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

-   spring 集成 slf4j

做 java web 开发，基本离不开 spring 框架。很遗憾，spring 使用的日志解决方案是 common-logging + log4j。

所以，你需要一个桥接 jar 包：logback-ext-spring。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>ch.qos.logback<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>logback-classic<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.1.3<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.logback-extensions<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>logback-ext-spring<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>0.1.2<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.slf4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>jcl-over-slf4j<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">  <span class="tag">&lt;<span class="name">version</span>&gt;</span>1.7.12<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

### 使用日志库时的注意事项

1.  **不要直接使用日志实现组件**

    -   使用日志门面（如 SLF4J）能使代码与特定的日志实现解耦。如果将来需要更换或升级日志实现，只需更改配置和依赖，而不需要修改代码。
    -   直接使用日志实现组件会导致代码与特定的日志实现紧密耦合在一起。这样的设计不利于代码的可移植性和重用性。
    -   在一个大型的应用或者多模块项目中，可能会使用多个库或框架，它们可能依赖于不同版本的同一个日志库。如果直接使用日志实现，可能会导致类路径冲突和版本冲突，增加了解决问题的难度。
    -   使用日志门面可以更容易地进行性能优化和适配。日志门面可以为不同的日志实现提供适配器，以优化性能或适应特定的环境。
    -   通过日志门面，可以更容易地统一日志的格式和风格，无论使用哪种日志实现。这有助于提高日志的可读性和统一性。
2.  **只引入一个具体的日志实现组件**

    > 解决dubbo那个issue的时候就遇到了这个问题，有一个模块在pom里直接引入了logf42作为日志实现，而引入的`dubbo-zookeeper-curator5-spring-boot-starter`里面又没有排除掉logback。导致在类路径里引入了多个日志实现。就会有警告，并且slf4j会自己选择其中一个作为实现。
    >
    > 那这么看来，应该算是`dubbo-zookeeper-curator5-spring-boot-starter`这个stater的问题，它应该把logback的依赖设置为optional，不应该直接传递过来。（可以去提个issue并解决
    >
    > ![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatrainbow.png)
    >
    > ）

    -   如果引入多个日志实现组件，可能会导致类路径冲突、不一致的日志行为或者混乱的日志输出。这可能会增加维护成本，并且在解决问题时可能会变得非常困难。
    -   每增加一个日志实现组件都会增加项目的复杂性。不同的日志实现可能有自己特有的配置、API和行为，这会增加学习成本和维护难度。
    -   只使用一个日志实现组件可以确保日志输出的一致性和统一性，有助于更好地理解和分析日志信息。
3.  **具体的日志实现依赖应该设置为optional和使用runtime scope**

    在项目中，Log Implementation的依赖强烈建议设置为runtime scope，并且设置为optional。例如项目中使用了 SLF4J 作为 Log Facade，然后想使用 Log4j2 作为 Implementation，那么使用 maven 添加依赖的时候这样设置:

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.apache.logging.log4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>log4j-core<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>${log4j.version}<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">scope</span>&gt;</span>runtime<span class="tag">&lt;/<span class="name">scope</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">optional</span>&gt;</span>true<span class="tag">&lt;/<span class="name">optional</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.apache.logging.log4j<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>log4j-slf4j-impl<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">version</span>&gt;</span>${log4j.version}<span class="tag">&lt;/<span class="name">version</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">scope</span>&gt;</span>runtime<span class="tag">&lt;/<span class="name">scope</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">optional</span>&gt;</span>true<span class="tag">&lt;/<span class="name">optional</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>

    设为optional，依赖不会传递，这样如果你是个lib项目，然后别的项目使用了你这个lib，不会被引入不想要的Log Implementation 依赖；Scope设置为runtime，是为了防止开发人员在项目中直接使用Log Implementation中的类，而不使用Log Facade中的类。

4.  **必要时排除依赖的第三方库中的Log Impementation依赖**

    这是很常见的一个问题，第三方库的开发者未必会把具体的日志实现或者桥接器的依赖设置为optional，然后你的项目继承了这些依赖——具体的日志实现未必是你想使用的，比如他依赖了Log4j，你想使用Logback，这时就很尴尬。另外，如果不同的第三方依赖使用了不同的桥接器和Log实现，也极容易形成环。

    这种情况下，推荐的处理方法，是使用exclude来排除所有的这些Log实现和桥接器的依赖，只保留第三方库里面对Log Facade的依赖。

    > 这个也在上次解决issue的时候见到了：
    >
    > <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br></pre></td><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="name">dependency</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.springframework.boot<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>spring-boot-starter<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;<span class="name">exclusions</span>&gt;</span></span><br><span class="line">        <span class="tag">&lt;<span class="name">exclusion</span>&gt;</span></span><br><span class="line">            <span class="tag">&lt;<span class="name">artifactId</span>&gt;</span>spring-boot-starter-logging<span class="tag">&lt;/<span class="name">artifactId</span>&gt;</span></span><br><span class="line">            <span class="tag">&lt;<span class="name">groupId</span>&gt;</span>org.springframework.boot<span class="tag">&lt;/<span class="name">groupId</span>&gt;</span></span><br><span class="line">        <span class="tag">&lt;/<span class="name">exclusion</span>&gt;</span></span><br><span class="line">    <span class="tag">&lt;/<span class="name">exclusions</span>&gt;</span></span><br><span class="line"><span class="tag">&lt;/<span class="name">dependency</span>&gt;</span></span><br></pre></td></tr></tbody></table>
    >
    > 这个为了排除掉springboot自带的日志实现logback。因为项目中使用的是log4j2。如果不exclude的话，可能会造成日志冲突。
    >
    > 当时是log4j-to-slf4j在springboot-starter里面有引入；log4j-slf4j2-impl在spring-boot-starter-log4j2里面。这两个桥接器造成了冲突。
