---
title: "记录第一次在开源社区提交pr的过程"
description: "记录第一次参与 Apache Dubbo 开源社区并提交 PR 的完整过程。"
publishedAt: "2024-04-11T01:45:12.000Z"
updatedAt: "2024-08-14T01:36:47.436Z"
tags: ["开源","Dubbo"]
featured: true
draft: false
legacyPath: "/2024/04/11/记录第一次在开源社区提交pr/"
---
记录解决dubbo社区issue的过程！这是一个good-first-issue，比较适合社区的新人。我刚看到issue描述的时候觉得很容易完成，更新相关依赖不就可以了，几分钟就搞定了吧。然而当我第一次push到仓库进行ci测试之后，才真正见识到了依赖版本冲突的可怕…

## issue描述

[https://github.com/apache/dubbo/issues/13862](https://github.com/apache/dubbo/issues/13862)

-   component： Java Samples (apache/dubbo-samples)
-   description：
    1.  Dubbo Samples switched the required JDK version to OpenJDK17.
    2.  Dubbo Samples are entirely switched to SpringBoot3.
-   related：
    1.  [https://github.com/apache/dubbo/discussions/13841](https://github.com/apache/dubbo/discussions/13841) 关于issue的讨论，用处不大
    2.  [https://github.com/apache/dubbo-samples/pull/1057](https://github.com/apache/dubbo-samples/pull/1057) 别人提交过的pr，可以参考
    3.  [https://github.com/apache/dubbo-samples/pull/1089](https://github.com/apache/dubbo-samples/pull/1089)

## 背景调研

-   apache/dubbo-samples仓库是干什么的？

    -   用来演示dubbo的用途。里面有很多个子项目，分别展示了dubbo从基础到进阶的各种用法。
    -   利用这些sample通过docker来进行dubbo的集成测试。
-   这些samples怎么运行？

    -   直接clone之后找到自己想要的某个sample，单独构建运行一个子项目。不要直接运行整个项目，太大了。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">$ <span class="built_in">cd</span> 1-basic/dubbo-samples-spring-boot</span><br><span class="line">$ mvn clean package</span><br></pre></td></tr></tbody></table>

-   具体描述issue是要做什么事情?

    -   把这些sample的jdk版本更新到jdk17。之前可能用的比较老的版本。springboot3最低支持JDK 17 ，不再支持JDK 17之前的版本。 所以这些samples是为了更新springboot的版本，比如springboot3。因此也要更新jdk版本。

        猜测sample里的项目大多都是基于springboot开发的，因此更新这个仓库里的所有项目需要很大的工作量。他才会让我们只负责单独的某个或几个模块。

-   相关的那个pr是做了什么事情？

    -   把相关项目的pom文件的java版本target和source改为17，springboot版本改为3.2：

        ![image-20240409093015863](/assets/image-20240409093015863.png)


## 解决过程

-   找到项目对应模块中使用到springboot的地方，将pom文件的属性改一下就行。

    测试失败！！！

    springcloud的服务提供者provider可以正常启动。

    Dubbo Client服务调用方无法正常启动：

    ![image-20240409183805774](/assets/image-20240409183805774.png)

    查看日志发现报错：在注册中心里面找不到provider。

    将分支切换回master,使用原来的测试用例启动provider时，可以在nacos的控制台查看注册的服务列表：

    ![image-20240409184753290](/assets/2024-04-11-230400.png)

    这个服务是有注册上的。而报错的分支却没有注册服务。因此，问题出在更新代码之后provider没有办法正常在nacos注册。

-   springboot和springcloud是有版本的对应关系的，我刚刚只更新了springboot的版本而没有同步更新cloud的版本，导致出现了问题。

    在spring的官网查看spring官网查看springboot和springcloud的版本对应关系：

    ![image-20240409190123904](/assets/image-20240409190123904.png)

    查看springboot与springcloudalibaba的版本对应关系：

    [https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E#%E7%BB%84%E4%BB%B6%E7%89%88%E6%9C%AC%E5%85%B3%E7%B3%BB](https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E#%E7%BB%84%E4%BB%B6%E7%89%88%E6%9C%AC%E5%85%B3%E7%B3%BB)

    将spring-cloud和spring-cloud-alibaba的版本更新后，全部正常。提交看看CI测试。不通过。

-   wc,把另一个模块给忘了。赶紧把sc-call-dubbo的模块也改了 : 以来都改了之后，手动调用是正常的。

    但是测试用例却通过不了：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br><span class="line">22</span><br><span class="line">23</span><br><span class="line">24</span><br><span class="line">25</span><br><span class="line">26</span><br></pre></td><td class="code"><pre><span class="line"><span class="meta">@Test</span></span><br><span class="line">   <span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">test</span><span class="params">()</span> {</span><br><span class="line">  </span><br><span class="line">       <span class="type">String</span> <span class="variable">url</span> <span class="operator">=</span> String.format(<span class="string">"http://%s:8099/dubbo/rest/test1"</span>, consumerAddress);</span><br><span class="line">       <span class="type">RestTemplate</span> <span class="variable">restTemplate</span> <span class="operator">=</span> <span class="keyword">new</span> <span class="title class_">RestTemplate</span>();</span><br><span class="line">       <span class="type">UserList</span> <span class="variable">userList</span> <span class="operator">=</span> restTemplate.getForObject(url, UserList.class);</span><br><span class="line">  </span><br><span class="line">       <span class="keyword">assert</span> userList != <span class="literal">null</span>;</span><br><span class="line">       Assert.assertEquals(<span class="number">1</span>, userList.getUsers().size());</span><br><span class="line">   }</span><br><span class="line">  </span><br><span class="line"><span class="keyword">public</span> <span class="keyword">class</span> <span class="title class_">UserList</span> {</span><br><span class="line">       <span class="keyword">private</span> List&lt;User&gt; users;</span><br><span class="line">  </span><br><span class="line">       <span class="keyword">public</span> <span class="title function_">UserList</span><span class="params">()</span> {</span><br><span class="line">           users = <span class="keyword">new</span> <span class="title class_">ArrayList</span>&lt;&gt;();</span><br><span class="line">       }</span><br><span class="line">  </span><br><span class="line">       <span class="keyword">public</span> List&lt;User&gt; <span class="title function_">getUsers</span><span class="params">()</span> {</span><br><span class="line">           <span class="keyword">return</span> users;</span><br><span class="line">       }</span><br><span class="line">  </span><br><span class="line">       <span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">setUsers</span><span class="params">(List&lt;User&gt; users)</span> {</span><br><span class="line">           <span class="built_in">this</span>.users = users;</span><br><span class="line">       }</span><br><span class="line">   }</span><br></pre></td></tr></tbody></table>

    ![image-20240409200848526](/assets/image-20240409200848526.png)

    报错信息提示：在将调用返回的结果json转为UserList的时候发生了错误。

    自己在浏览器调用应用的服务拿到返回数据：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line"><span class="punctuation">[</span><span class="punctuation">{</span><span class="attr">"id"</span><span class="punctuation">:</span><span class="number">1</span><span class="punctuation">,</span><span class="attr">"name"</span><span class="punctuation">:</span><span class="string">"Dubbo provider!"</span><span class="punctuation">}</span><span class="punctuation">]</span></span><br></pre></td></tr></tbody></table>

    这是一个json数组，里面包含一个对象。这个对象有两个属性 `id` 和 `name`。对应着sample里的实体类User。用UserList来接收json反序列化后的对象，即一个对象里面有一个类型为数组的属性。与返回数据不匹配啊，直接返回的是一个数组。把测试用例改一下试一试：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br></pre></td><td class="code"><pre><span class="line"><span class="meta">@Test</span></span><br><span class="line">   <span class="keyword">public</span> <span class="keyword">void</span> <span class="title function_">test</span><span class="params">()</span> {</span><br><span class="line">       <span class="type">String</span> <span class="variable">url</span> <span class="operator">=</span> String.format(<span class="string">"http://%s:8099/dubbo/rest/test1"</span>, consumerAddress);</span><br><span class="line">       <span class="type">RestTemplate</span> <span class="variable">restTemplate</span> <span class="operator">=</span> <span class="keyword">new</span> <span class="title class_">RestTemplate</span>();</span><br><span class="line">       </span><br><span class="line">       <span class="comment">// 直接解析为 List&lt;User&gt;</span></span><br><span class="line">       List&lt;User&gt; userList = restTemplate.getForObject(url, List.class);</span><br><span class="line">  </span><br><span class="line">       Assert.assertNotNull(userList);</span><br><span class="line">       Assert.assertEquals(<span class="number">1</span>, userList.size());</span><br><span class="line">   }</span><br></pre></td></tr></tbody></table>

    ok,本地测试通过了。但是ci测试还是不通过。

-   55个测试只通过了49个。

    ![image-20240411213937026](/assets/image-20240411213937026.png)

    查看详细的日志，一直是这两个模块environment-keys和call-back的问题:

    Dubbo 3.3 / Test Result (Java17)

    ![image-20240410170139356](/assets/image-20240410170139356.png)

    Dubbo 3.3 / Test Result (Java21)

    ![image-20240410171302150](/assets/image-20240410171302150.png)

    integration Test (Java17, Job3)

    ![image-20240410171600726](/assets/image-20240410171600726.png)

    integration Test (Java21, Job3)

    ![image-20240410171827593](/assets/image-20240410171827593.png)

    > 日志框架出现了多个绑定：[https://www.slf4j.org/codes.html#multiple\_bindings](https://www.slf4j.org/codes.html#multiple_bindings)

    integration Test (Java17, Job4)

    ![image-20240410171940696](/assets/image-20240410171940696.png)

    integration Test (Java21, Job4)

    ![image-20240410172145757](/assets/image-20240410172145757.png)

    Integration Test Job3失败的原因在于：environment-keys-provider出现了多个日志实现。

    Integration Test Job4失败的原因在于：callback-consumer无法连接找到provider提供的服务。

    而test result失败就是因为有了这两个job的失败，在merge test result时会出现两个失败的case。

    在java17和java21版本各有3个failures，所以一共有6个不通过的ci测试。

    只要解决Integration Test Job3和Integration Test Job4即可。

-   着手解决job3:

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br></pre></td><td class="code"><pre><span class="line">SLF4J(W): Class path contains multiple SLF4J providers.</span><br><span class="line">SLF4J(W): Found provider [org.apache.logging.slf4j.SLF4JServiceProvider@3cd1f1c8]</span><br><span class="line">SLF4J(W): Found provider [ch.qos.logback.classic.spi.LogbackServiceProvider@3a4afd8d]</span><br><span class="line">SLF4J(W): See https:<span class="comment">//www.slf4j.org/codes.html#multiple_bindings for an explanation.</span></span><br><span class="line">SLF4J(I): Actual provider is of type [org.apache.logging.slf4j.SLF4JServiceProvider@3cd1f1c8]</span><br><span class="line">Exception in thread <span class="string">"main"</span> java.lang.ExceptionInInitializerError</span><br><span class="line">	at org.apache.dubbo.samples.environment.keys.provider.ProviderApplication.main(ProviderApplication.java:<span class="number">28</span>)</span><br><span class="line">Caused by: org.apache.logging.log4j.LoggingException: log4j-slf4j2-impl cannot be present with log4j-to-slf4j</span><br><span class="line">	at org.apache.logging.slf4j.Log4jLoggerFactory.validateContext(Log4jLoggerFactory.java:<span class="number">70</span>)</span><br><span class="line">	at org.apache.logging.slf4j.Log4jLoggerFactory.newLogger(Log4jLoggerFactory.java:<span class="number">50</span>)</span><br><span class="line">	at org.apache.logging.slf4j.Log4jLoggerFactory.newLogger(Log4jLoggerFactory.java:<span class="number">33</span>)</span><br><span class="line">	at org.apache.logging.log4j.spi.AbstractLoggerAdapter.getLogger(AbstractLoggerAdapter.java:<span class="number">53</span>)</span><br><span class="line">	at org.apache.logging.slf4j.Log4jLoggerFactory.getLogger(Log4jLoggerFactory.java:<span class="number">33</span>)</span><br><span class="line">	at org.slf4j.LoggerFactory.getLogger(LoggerFactory.java:<span class="number">422</span>)</span><br><span class="line">	at org.apache.commons.logging.LogAdapter$Slf4jAdapter.createLocationAwareLog(LogAdapter.java:<span class="number">121</span>)</span><br><span class="line">	at org.apache.commons.logging.LogAdapter.createLog(LogAdapter.java:<span class="number">95</span>)</span><br><span class="line">	at org.apache.commons.logging.LogFactory.getLog(LogFactory.java:<span class="number">67</span>)</span><br><span class="line">	at org.apache.commons.logging.LogFactory.getLog(LogFactory.java:<span class="number">59</span>)</span><br><span class="line">	at org.springframework.boot.SpringApplication.&lt;clinit&gt;(SpringApplication.java:<span class="number">202</span>)</span><br><span class="line">	... <span class="number">1</span> more</span><br><span class="line"></span><br></pre></td></tr></tbody></table>

    在应用程序中，发现了多个 SLF4J 的提供者，

    -   `org.apache.logging.slf4j.SLF4JServiceProvider@3cd1f1c8`
    -   `ch.qos.logback.classic.spi.LogbackServiceProvider@3a4afd8d`

    这只是警告，它也自己选了`ch.qos.logback.classic.spi.LogbackServiceProvider@3a4afd8d`这个实现。

    在错误消息指出了 `log4j-slf4j2-impl` 和 `log4j-to-slf4j` 不能同时存在。这是因为这两个依赖提供了不同的方式来桥接 Log4j 和 SLF4J，而它们之间可能会发生冲突。解决这个问题的方法通常是排除其中一个冲突的依赖，以确保只有一个 SLF4J 的实现被加载。

    idea里打开dubbo.samples.environment.keys.provider模块，在maven插件里搜索这两个依赖：

    发现`log4j-to-slf4j`是在`spring-boot-starter`里的`spring-boot-logging`引入的

    ![image-20240411220256798](/assets/image-20240411220256798.png)

    而`log4j-slf4j2-impl`则是在`spring-boot-starter-log4j2`里引入的。

    ![image-20240411220511404](/assets/image-20240411220511404.png)

    删除它们中的任意一个依赖就可以了。

    > ps : 我当时思路还没这么清晰，在引入`spring-boot-starter`的时候把`spring-boot-logging`排除掉：
    >
    > (其实在这里还有一个问题，在`dubbo.samples.environment.keys.provider`的父模块里进行依赖管理(标签)的时候，已经把这个`spring-boot-starter-logging`给排除了，子模块直接引入spring-boot-starter的时候为什么还是把它引进来了？)
    >
    > <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br></pre></td><td class="code"><pre><span class="line">&lt;!-- spring starter --&gt;</span><br><span class="line">    &lt;dependency&gt;</span><br><span class="line">        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span><br><span class="line">        &lt;artifactId&gt;spring-boot-starter&lt;/artifactId&gt;</span><br><span class="line">        &lt;version&gt;${spring-boot.version}&lt;/version&gt;</span><br><span class="line">        &lt;exclusions&gt;</span><br><span class="line">            &lt;exclusion&gt;</span><br><span class="line">                &lt;artifactId&gt;spring-boot-starter-logging&lt;/artifactId&gt;</span><br><span class="line">                &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span><br><span class="line">            &lt;/exclusion&gt;</span><br><span class="line">        &lt;/exclusions&gt;</span><br><span class="line">    &lt;/dependency&gt;</span><br></pre></td></tr></tbody></table>
    >
    > 还顺手把`spring-boot-starter-log4j2`依赖给删了，本来以为这样会破坏它的日志系统，因为删掉了日志实现组件。但是这是没问题的，因为在`dubbo-zookeeper-curator5-spring-boot-starter`这个依赖里面它引入了`logback-classic` ，所以在这个模块里的日志库使用的是`log4j + logback`。

    奈斯奈斯！！！job3解决！！！

    ![image-20240411221136963](/assets/image-20240411221136963.png)

-   接下来解决job4:

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br></pre></td><td class="code"><pre><span class="line">----------------------------------------------------------</span><br><span class="line"> dubbo-samples-callback log: callback-consumer.log</span><br><span class="line">----------------------------------------------------------</span><br><span class="line">Start at: <span class="number">2024</span>-<span class="number">04</span>-09 <span class="number">12</span>:<span class="number">34</span>:<span class="number">51</span></span><br><span class="line">Waiting ports before run test ..</span><br><span class="line">checking tcp ports: callback-provider:<span class="number">2181</span>;callback-provider:<span class="number">20880</span>;, start at: <span class="number">0</span>, timeout: <span class="number">180</span></span><br><span class="line">checking tcp port [callback-provider:<span class="number">2181</span>] ...</span><br><span class="line">telnet: Unable to connect to remote host: Connection refused</span><br><span class="line">Trying <span class="number">192.168</span><span class="number">.48</span><span class="number">.2</span>...</span><br><span class="line">telnet: Unable to connect to remote host: Connection refused</span><br><span class="line">Trying <span class="number">192.168</span><span class="number">.48</span><span class="number">.2</span>...</span><br><span class="line">Trying <span class="number">192.168</span><span class="number">.48</span><span class="number">.2</span>...</span><br><span class="line">Connected to callback-provider.</span><br><span class="line">Escape character is <span class="string">'^]'</span>.</span><br></pre></td></tr></tbody></table>

    callback-consumer找不到provider,连接超时了哇。猜测是provider无法正常在Zookeeper注册。

    运行一下测试用例,发现了一个错误信息：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br></pre></td><td class="code"><pre><span class="line"><span class="number">12</span>:<span class="number">59</span>:<span class="number">33.141</span> [ZooKeeper Server Starter] INFO org.apache.zookeeper.audit.ZKAuditProvider -- ZooKeeper audit is disabled.</span><br><span class="line"><span class="number">12</span>:<span class="number">59</span>:<span class="number">33.688</span> |-ERROR [main]          org.apache.dubbo.common.Version:<span class="number">111</span> -|  [DUBBO] Inconsistent version <span class="number">3.2</span><span class="number">.3</span> found in dubbo-zookeeper-curator5-spring-boot-starter from file:/D:/devTool/Maven/maven-repository/org/apache/dubbo/dubbo-zookeeper-curator5-spring-boot-starter/<span class="number">3.2</span><span class="number">.3</span>/dubbo-zookeeper-curator5-spring-boot-starter-<span class="number">3.2</span><span class="number">.3</span>.jar!/META-INF/versions/dubbo-zookeeper-curator5-spring-boot-starter, expected dubbo-common version is <span class="number">3.3</span><span class="number">.0</span>-beta<span class="number">.1</span>, dubbo version: <span class="number">3.3</span><span class="number">.0</span>-beta<span class="number">.1</span>, current host: <span class="number">169.254</span><span class="number">.123</span><span class="number">.149</span>, error code: <span class="number">0</span>-<span class="number">12.</span> This may be caused by , go to https:<span class="comment">//dubbo.apache.org/faq/0/12 to find instructions. </span></span><br><span class="line"><span class="number">12</span>:<span class="number">59</span>:<span class="number">33.692</span> |-ERROR [main]          org.apache.dubbo.common.Version:<span class="number">111</span> -|  [DUBBO] Inconsistent git build commit id 8256e5646f5589bced5c458db586cae70cd16e2f found in dubbo-zookeeper-curator5-spring-boot-starter from file:/D:/devTool/Maven/maven-repository/org/apache/dubbo/dubbo-zookeeper-curator5-spring-boot-starter/<span class="number">3.2</span><span class="number">.3</span>/dubbo-zookeeper-curator5-spring-boot-starter-<span class="number">3.2</span><span class="number">.3</span>.jar!/META-INF/versions/dubbo-zookeeper-curator5-spring-boot-starter, expected dubbo-common version is 0c9d5e2f7383760018db38877863d6fc16fd6689, dubbo version: <span class="number">3.3</span><span class="number">.0</span>-beta<span class="number">.1</span>, current host: <span class="number">169.254</span><span class="number">.123</span><span class="number">.149</span>, error code: <span class="number">0</span>-<span class="number">12.</span> This may be caused by , go to https:<span class="comment">//dubbo.apache.org/faq/0/12 to find instructions. </span></span><br></pre></td></tr></tbody></table>

    这个错误消息表明在项目中发现了不一致的 Dubbo 版本信息。Dubbo 在运行时发现了一个与预期版本不一致的组件，这可能导致一些问题。在日志中，Dubbo 发现了一个名称为 `dubbo-zookeeper-curator5-spring-boot-starter` 的组件，其版本为 `3.2.3`，但是 Dubbo 期望的版本是 `3.3.0-beta.1`。

    soga，原来是starter的版本跟dubbo版本冲突了！！

    那就把`dubbo-zookeeper-curator5-spring-boot-starter`改为`3.3.0-beta.1`

    完美解决！！！

    ![image-20240411141554011](/assets/image-20240411141554011.png)


## 总结

**梳理一遍流程：**

springcloud模块：

1.  更新相关依赖
2.  更新test case
3.  更新test-case configuration

environment-keys的consumer和provider模块：

1.  删除spring-boot-starter-log4j2依赖 （其实排除dubbo-zookeeper-curator5-spring-boot-starter里的logback更好）
2.  在spring-boot-starter里面排除logging

callback模块:

1.  修改dubbo-zookeeper-curator5-spring-boot-starter版本
2.  修改日志依赖

> 可是我刚刚去测试了一遍如果不删除spring-boot-starter-log4j2的依赖，callback和environment-keys模块还是会有那个警告…
>
> 那个警告来自slf4j,提示你在项目的classpath里面引入了两个日志实现log4j2和logback,移除掉其中一个就好了。
>
> 但是在maven的依赖树里查找就不存在 `log4j-slf4j2-impl` 和 `log4j-to-slf4j` 同时存在的问题。

**总结一下这次解决issue的收获：**

-   做事情要专注并且持续地做完。不能像上次解决issue的时候三天打鱼两天晒网，断断续续地，最后没有完成任务。
-   看日志要有耐心并且仔细，快速定位到问题。不要日志随便一扫就盲目靠感觉去试，那样子成功了只是运气好，一定要学会好好分析问题。
-   需要学习一下GitHub ci的相关知识，这样有助于更好理解ci测试failure是为什么
-   需要重新复习java的日志库，日志系统和日志门面又忘了。刚好这次遇到了日志框架冲突的问题，可以结合这个例子加深一下印象。

## Appendix

过了5天终于把我的pr合并啦~

![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatattentionreverse.png)



![](https://gcore.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs/ablobcatattentionreverse.png)

![image-20240416212254237](/assets/image-20240416212254237.png)

还给我点了个赞，非常开心！！！

![image-20240416091309066](/assets/image-20240416091309066.png)

* * *

又回来这个仓库看看，发现项目中使用的日志框架都是slf4j + log4j2。而在我提交的pr中，把两个模块的日志框架改成了logback + slf4j。这和项目不统一，应该修改。同时在项目中也存在着许多日志警告的问题，大都是在引入`dubbo-zookeeper-curator5-spring-boot-starter`的时候没有排除掉对应的依赖。

下面列出存在问题的模块：

-   dubbo-samples-cache 、dubbo-samples-group 、dubbo-samples-mock 、dubbo-samples-notify 、dubbo-samples-rpccontext 、dubbo-samples-service-discovery 、dubbo-samples-spring-security 、dubbo-samples-validation ：存在多个日志实现的警告（原因：引入dubbo-zookeeper-curator5-spring-boot-starter没有排除logback；这个版本`3.3.0-beta.2-SNAPSHOT`已经将日志依赖设置为optional，`3.3.0-beta.1` 则会存在这个问题）
-   dubbo-samples-callback 、 dubbo-samples-environment-keys 使用了logback , 而不是项目统一的log4j2

对于存在多个日志实现的警告，解决方法有两种：

1.  在引入依赖时手动排除掉logback的相关依赖
2.  引入新版本的`dubbo-zookeeper-curator5-spring-boot-starter` , 及`3.3.0-beta.2`，这个版本已经不会自动将日志实现一起引入。

对于日志框架不统一的问题，需要自己再手动解决：

1.  在依赖管理中排除`dubbo-zookeeper-curator5-spring-boot-starter`中的logback相关依赖
2.  引入slf4j2的相关依赖
