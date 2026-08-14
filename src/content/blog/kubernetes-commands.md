---
title: "K8s常用命令总结"
description: "项目实践中常用的 Kubernetes 命令与排查方式总结。"
publishedAt: "2024-08-22T03:38:27.000Z"
updatedAt: "2024-11-14T11:27:19.326Z"
tags: ["Kubernetes"]
featured: false
draft: false
legacyPath: "/2024/08/22/K8s常用命令总结/"
---
总结一下这次在项目中经常使用的一些 K8s 的命令。

## K8s 常用命令总结

* * *

### 1\. 获取 Kubernetes 集群信息

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl cluster-info</span><br></pre></td></tr></tbody></table>

**场景**: 查看 Kubernetes 集群的基本信息，包括 API 服务器的地址。

* * *

### 2\. 获取节点信息

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get nodes</span><br></pre></td></tr></tbody></table>

**场景**: 查看集群中所有节点的状态，帮助确认节点是否健康，以及节点资源的使用情况。

* * *

### 3\. 获取 Pod 列表

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get pods</span><br></pre></td></tr></tbody></table>

**场景**: 查看指定命名空间中的所有 Pod 的状态，检查 Pod 是否正在运行。

* * *

### 4\. 获取 Pod 的详细信息

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl describe pod &lt;pod-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 获取 Pod 的详细描述，包括状态、事件、日志等，帮助进行故障排查。

* * *

### 5\. 获取 Pod 的标签

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get pod &lt;pod-name&gt; -o=jsonpath=<span class="string">'{.metadata.labels}'</span></span><br></pre></td></tr></tbody></table>

**场景**: 获取某个 Pod 的标签，方便进行标签筛选和调度管理。

* * *

### 6\. 删除 Pod

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl delete pod &lt;pod-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 删除指定的 Pod。常用于清理挂掉或无用的 Pod。

* * *

### 7\. 强制删除 Pod

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl delete pod &lt;pod-name&gt; --grace-period=0 --force -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 强制删除 Pod，适用于无法正常删除的 Pod。注意，这种操作会跳过 Pod 的优雅终止过程。

* * *

### 8\. 获取 Pod 的日志

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl logs &lt;pod-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看 Pod 中容器的日志，帮助排查应用问题或容器启动失败的原因。

* * *

### 9\. 查看 Pod 的实时日志（带容器名）

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl logs -f &lt;pod-name&gt; -c &lt;container-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 实时查看指定容器的日志，适用于跟踪应用程序运行中的问题。

* * *

### 10\. 进入 Pod 内部

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl <span class="built_in">exec</span> -it &lt;pod-name&gt; -n &lt;namespace&gt; -- /bin/bash</span><br></pre></td></tr></tbody></table>

**场景**: 进入 Pod 内部，执行交互式命令，适用于调试和手动操作。

* * *

### 11\. 执行 Pod 内部命令

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl <span class="built_in">exec</span> &lt;pod-name&gt; -n &lt;namespace&gt; -- &lt;<span class="built_in">command</span>&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 在 Pod 内部执行一次性命令，适用于临时操作。

* * *

### 12\. 查看命名空间中的所有资源

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get all -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看命名空间中的所有资源（Pod、Service、Deployment 等），用于快速浏览资源状态。

* * *

### 13\. 部署应用（使用 YAML 配置）

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl apply -f &lt;file.yaml&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 根据指定的 YAML 文件创建或更新资源，常用于部署应用、配置服务等。

* * *

### 14\. 删除命名空间

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl delete namespace &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 删除指定命名空间及其资源，适用于清理整个环境。

* * *

### 15\. 查看服务的详细信息

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl describe svc &lt;service-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看服务的详细信息，包括端口、选择器等，适用于调试服务访问问题。

* * *

### 16\. 获取集群的 ConfigMap 列表

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get configmap -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看命名空间中所有的 ConfigMap，帮助管理配置文件。

* * *

### 17\. 创建 ConfigMap

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl create configmap &lt;configmap-name&gt; --from-file=&lt;path-to-file&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 创建 ConfigMap 资源并从文件中导入配置，常用于存储配置文件或密钥。

* * *

### 18\. 获取所有 Pod 的标签

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get pods --show-labels -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 获取所有 Pod 的标签信息，便于筛选和管理。

* * *

### 19\. 获取某个资源的版本

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl version</span><br></pre></td></tr></tbody></table>

**场景**: 查看 kubectl 客户端和 Kubernetes 服务端的版本信息，帮助确认版本兼容性。

* * *

### 20\. 使用 Port Forward 转发端口

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl port-forward pod/&lt;pod-name&gt; 8080:80 -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 将 Pod 的端口转发到本地，适用于访问集群内的应用（如本地访问 Pod 中的 Web 服务）。

* * *

### 21\. 查看 Pod 的状态

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get pod &lt;pod-name&gt; -n &lt;namespace&gt; -o wide</span><br></pre></td></tr></tbody></table>

**场景**: 查看 Pod 的状态和其他详细信息，如 IP 地址、节点等，帮助诊断 Pod 问题。

* * *

### 22\. 查看 Deployment 状态

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get deployment &lt;deployment-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看某个 Deployment 的状态，帮助确认应用是否按预期运行。

* * *

### 23\. 获取 Kubernetes 的 Config 配置文件

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl config view</span><br></pre></td></tr></tbody></table>

**场景**: 查看当前的 Kubernetes 配置，帮助查看已配置的集群和上下文。

* * *

### 24\. 修改 kubectl 使用的 Config 文件

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line"><span class="built_in">export</span> KUBECONFIG=&lt;path-to-kubeconfig&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 指定自定义的 kubeconfig 文件位置，避免使用默认的 `~/.kube/config`。

* * *

### 25\. 等待 Pod 删除完成

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl <span class="built_in">wait</span> --<span class="keyword">for</span>=delete pod &lt;pod-name&gt; -n &lt;namespace&gt; --<span class="built_in">timeout</span>=60s</span><br></pre></td></tr></tbody></table>

**场景**: 等待指定的 Pod 删除完成，用于确保 Pod 被完全删除。

* * *

### 26\. 查看 Pod 的进程

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl top pod &lt;pod-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看 Pod 中的资源使用情况（CPU、内存等），适用于性能调优和资源监控。

* * *

### 27\. 查看命名空间的资源

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl get all -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看某个命名空间中的所有资源，帮助管理和维护集群。

* * *

### 28\. 监控服务的状态

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl rollout status deployment/&lt;deployment-name&gt; -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 查看 Deployment 的发布状态，适用于查看应用更新或滚动升级的进度。

* * *

### 29\. 更新资源

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">kubectl apply -f &lt;file.yaml&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 更新现有的 Kubernetes 资源，适用于应用更新或配置变更。

* * *

### 30\. 获取 Helm 安装的 Release 列表

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">helm list -n &lt;namespace&gt;</span><br></pre></td></tr></tbody></table>

**场景**: 获取 Helm 安装的所有 Release，帮助管理 Helm 部署的应用。
