---
title: "git的原理简介及其常用命令总结"
description: "从对象模型与引用机制理解 Git 原理，并整理常用命令。"
publishedAt: "2024-04-03T01:44:41.000Z"
updatedAt: "2024-11-03T08:11:41.507Z"
tags: ["Git"]
featured: false
draft: false
legacyPath: "/2024/04/03/git的原理简介及其常用命令总结/"
---
总结一下git的基本使用以及记录一些自己遇到的场景

## 基本原理简介

### 版本控制

-   本地版本控制：采用某种简单的数据库来记录文件的历次更新差异。

    缺点：无法让在不同系统上的开发者协同工作。

-   集中式版本控制：有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。

    缺点：中央服务器可能会造成单点故障，整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险。

-   分布式版本控制：客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来。 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份。


### 基本特点

1.  **直接记录快照，而非差异比较**

    -   例如 CVS、Subversion、Perforce 等等，这些系统是以“文件差异（增量）”的方式来保存文件历史。简单来说，它们存储的是文件在不同版本之间的变化（变更列表）。每个文件被视作一个基础版本，随后记录的是它每次被修改时的“增量”，也就是每次变化的内容。这种方式让文件的每个版本都可以回溯到之前的变动。

    -   Git 不使用增量存储，而是每次提交时对所有文件创建一个快照（类似“拍照”）。Git 会将这些快照链接起来，组成一个完整的历史记录。如果文件没有发生变化，Git 并不会重复存储这个文件，而是建立一个指向之前快照的链接。因此，Git 的存储方式更高效。这种快照流的存储方式带来了 Git 的强大功能，比如快速切换分支和轻松回溯历史记录，因为每个提交点实际上是项目在该时间点的完整状态。

        ![image-20241103151506249](/assets/image-20241103151506249.png)

        > **性能与结构的不同**：
        >
        > -   Git 的快照方式本质上更类似于一个轻量级的文件系统，它通过快照的索引和链接构建出完整的项目历史。每个提交包含一个指向全部文件状态的完整快照，这让 Git 能够在复杂操作中高效定位到整个项目的完整状态，而传统增量系统则更依赖于逐步比对增量差异。
        >
        > **分支和切换效率**：
        >
        > -   Git 的快照方式让分支成为项目的一个独立路径，而不是基于变更列表进行拼凑，因此可以实现快速分支和切换。在传统的版本控制中，分支是基于“变更”的集合，分支切换时需要逐个文件地应用或撤销变更，因而更慢。
        >
        > **版本回溯**：
        >
        > -   Git 中的每次提交即为项目的完整状态，这意味着 Git 能直接定位任意版本，避免了增量变更系统中的多次回溯，适合更大规模的数据管理

2.  **近乎所有操作都是本地执行**

    Git 的项目历史在本地存储，这意味着在查看提交历史或对比当前版本与旧版本的改动时，Git 直接读取本地数据库。无需连接服务器或下载额外数据，操作几乎是瞬时完成的。

    Git 的本地历史还意味着你可以在无网络连接的情况下执行几乎所有的 Git 操作。例如，修改代码、查看历史、创建分支、进行提交等。只需在有网络时同步即可。这在离线工作或网络不稳定（如旅行途中或 VPN 连接问题时）极为方便。

3.  **Git 保证完整性**

    Git 中所有数据在存储前都计算校验和，然后以校验和来引用。 这意味着不可能在 Git 不知情时更改任何文件内容或目录内容。 这个功能建构在 Git 底层，是构成 Git 哲学不可或缺的部分。 若在传送过程中丢失信息或损坏文件，Git 就能发现。

    Git 用以计算校验和的机制叫做 SHA-1 散列。 这是一个由 40 个十六进制字符（0-9 和 a-f）组成字符串，基于 Git 中文件的内容或目录结构计算出来。 SHA-1 哈希看起来是这样：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">24b9da6552252987aa493b52f8696cd6d3b00373</span><br></pre></td></tr></tbody></table>

    Git 中使用这种哈希值的情况很多，你将经常看到这种哈希值。 实际上，Git 数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名。


### Git 三大区域

Git 有三种状态，文件可能处于其中之一：已提交（committed）、已修改（modified）和已暂存（staged）。 已提交表示数据已经安全的保存在本地数据库中。 已修改表示修改了文件，但还没保存到数据库中。 已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。

由此引入 Git 项目的三个工作区域的概念：工作目录、暂存区域以及Git 仓库。

![image-20241103152021657](/assets/image-20241103152021657.png)

-   Git 仓库目录是 Git 用来保存项目的元数据和对象数据库的地方。 这是 Git 中最重要的部分，从其它计算机克隆仓库时，拷贝的就是这里的数据。

-   工作目录是对项目的某个版本独立提取出来的内容。 这些从 Git 仓库的压缩数据库中提取出来的文件，放在磁盘上以供使用或修改。

-   暂存区域是一个文件，保存了下次将提交的文件列表信息，一般在 Git 仓库目录中。


### 内部结构

在 Git 中，每次提交都会生成唯一的快照，而这些快照由四种核心对象构成：**Blob**、**Tree**、**Commit** 和 **Tag**。Git 使用这些对象及其关联关系来保存项目状态，并通过 SHA-1 哈希确保对象的唯一性。

![image-20241103153048940](/assets/image-20241103153048940.png)

#### 1\. Blob

-   Blob 是文件数据的基本存储单元，保存文件的内容而不是元数据（如文件名和权限）。
-   当文件被添加到 Git 时，Git 会将文件内容转换为 Blob 对象，并生成一个基于内容的 SHA-1 哈希作为 Blob 的唯一标识符。
-   如果文件内容没有变化，即使文件在不同提交中重复出现，Git 也只会保存一份 Blob，从而节省存储空间。

#### 2\. Tree

-   Tree 用于存储目录结构和文件关系，相当于文件夹。它包含多个文件（Blob）和子目录（Tree）的引用。
-   每个 Tree 对象保存了当前目录下的 Blob 和 Tree，并存储文件的元数据（如文件名和权限）。
-   Git 通过树对象可以迅速重建出整个项目的目录结构，从而为提交生成文件系统快照。

#### 3\. Commit

-   Commit 是 Git 中保存项目版本快照的对象，包含以下信息：
    -   指向根目录的 Tree 对象；
    -   提交者信息（姓名、邮箱和时间）；
    -   提交的 SHA-1 哈希；
    -   一个或多个父提交（单个提交通常有一个父提交，合并提交会有多个父提交）。
-   每次提交生成唯一的 SHA-1 哈希值，这个哈希不仅仅用于标识当前提交的内容，还能通过父提交关联生成提交历史。

#### 4\. Tag

-   **Tag** 为提交创建一个别名，通常用于标识重要的发布版本（如 v1.0、v2.0 等）。
-   标签对象包含提交对象的哈希、标签名称及描述信息。
-   标签有两种类型：
    -   轻量标签：直接指向某个提交，不包含额外的元数据；
    -   附注标签：可以包含签名、附加信息等，是一种更正式的标记。

#### SHA-1 哈希与版本管理

Git 使用 SHA-1 哈希来确保版本控制中的对象具有唯一性并实现数据完整性。SHA-1 哈希是一种加密散列函数，它会将输入内容（文件、目录或提交）生成一个长度为 40 个字符的十六进制字符串（160 位）。在 Git 中，每一个对象类型（Blob、Tree、Commit、Tag）都生成唯一的 SHA-1 哈希值，从而实现对内容的完整标识。这一设计是 Git 保证内容一致性和防篡改的基础。

-   **唯一标识**：哈希值是根据对象内容计算的，所以即使文件或目录被放在不同路径或仓库中，只要内容相同，生成的哈希值也完全相同。不同的内容，即使只是一个字符的改动，也会生成完全不同的哈希。
-   **防篡改性**：由于 SHA-1 哈希算法的特性，任何对文件内容的修改都会导致哈希值的变化。因此，一旦内容被更改，原先的哈希值就不再匹配，这让 Git 能够立即检测出更改。
-   **效率**：SHA-1 哈希允许 Git 通过哈希值快速地定位对象，不需要遍历整个仓库，从而大大提高版本检索的效率。

### 分支和合并模型

对工作目录的文件做些修改后再次提交，那么这次产生的提交对象会包含一个指向上次提交对象（父对象）的指针。

![image-20241103153207621](/assets/image-20241103153207621.png)

Git 的分支，其实本质上仅仅是指向提交对象的可变指针。 Git 的默认分支名字是 `master`。 在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 `master` 分支。 它会在每次的提交操作中自动向前移动。

![image-20241103153552098](/assets/image-20241103153552098.png)

## 常用命令

### 代码提交和同步代码

1.  **`git add <file>`**

    -   将指定文件添加到暂存区，准备提交。
    -   用 `git add .` 可以将所有修改的文件添加到暂存区。
2.  **`git commit -m "message"`**

    -   将暂存区的更改提交到本地仓库，使用 `-m` 选项添加提交说明。
3.  **`git status`**

    -   查看当前分支的状态，包括已修改但未提交的文件。
4.  **`git log`**

    -   查看提交历史，使用 `--oneline` 显示简洁的提交日志。
5.  **`git push <remote> <branch>`**

    -   将本地的提交同步到远程仓库的指定分支。
    -   常用 `git push origin master` 将本地 `master` 分支推送到远程仓库。
6.  **`git pull <remote> <branch>`**

    -   从远程仓库的指定分支拉取最新的更改并合并到当前分支，等价于 `fetch + merge` 操作。

* * *

### 代码撤销和撤销同步

**已修改，但未暂存**

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br></pre></td><td class="code"><pre><span class="line">$ git diff # 列出所有的修改</span><br><span class="line">$ git diff xx/xx.py xx/xx2.py # 列出某(几)个文件的修改</span><br><span class="line"></span><br><span class="line">$ git checkout # 撤销项目下所有的修改</span><br><span class="line">$ git checkout . # 撤销当前文件夹下所有的修改</span><br><span class="line">$ git checkout xx/xx.py xx/xx2.py # 撤销某几个文件的修改</span><br><span class="line">$ git clean -f # untracked状态，撤销新增的文件</span><br><span class="line">$ git clean -df # untracked状态，撤销新增的文件和文件夹</span><br><span class="line"></span><br><span class="line"># Untracked files:</span><br><span class="line">#  (use "git add &lt;file&gt;..." to include in what will be committed)</span><br><span class="line">#</span><br><span class="line">#	xxx.py</span><br></pre></td></tr></tbody></table>

**已暂存，未提交**

> 这个时候已经执行过git add，但未执行git commit，但是用git diff已经看不到任何修改。 因为git diff检查的是工作区与暂存区之间的差异。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br></pre></td><td class="code"><pre><span class="line">$ git diff --cached # 这个命令显示暂存区和本地仓库的差异</span><br><span class="line"></span><br><span class="line">$ git reset # 暂存区的修改恢复到工作区</span><br><span class="line">$ git reset --soft # 与git reset等价，回到已修改状态，修改的内容仍然在工作区中</span><br><span class="line">$ git reset --hard # 回到未修改状态，清空暂存区和工作区</span><br></pre></td></tr></tbody></table>

> git reset –hard 操作等价于 git reset 和 git checkout 2步操作

**已提交，未推送**

> 执行完commit之后，会在仓库中生成一个版本号(hash值)，标志这次提交。之后任何时候，都可以借助这个hash值回退到这次提交。

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br></pre></td><td class="code"><pre><span class="line">$ git diff &lt;branch-name1&gt; &lt;branch-name2&gt; # 比较2个分支之间的差异</span><br><span class="line">$ git diff master origin/master # 查看本地仓库与本地远程仓库的差异</span><br><span class="line"></span><br><span class="line">$ git reset --hard origin/master # 回退与本地远程仓库一致</span><br><span class="line">$ git reset --hard HEAD^ # 回退到本地仓库上一个版本</span><br><span class="line">$ git reset --hard &lt;hash code&gt; # 回退到任意版本</span><br><span class="line">$ git reset --soft/git reset # 回退且回到已修改状态，修改仍保留在工作区中。</span><br><span class="line">$ git revert &lt;commit&gt; # 创建一个新的提交，用于撤销指定的提交，适合用于已推送到远程的提交记录。</span><br></pre></td></tr></tbody></table>

**已推送到远程**

<table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">$ git push -f orgin master # 强制覆盖远程分支</span><br><span class="line">$ git push -f # 如果之前已经用 -u 关联过，则可省略分支名</span><br></pre></td></tr></tbody></table>

> 慎用，一般情况下，本地分支比远程要新，所以可以直接推送到远程，但有时推送到远程后发现有问题，进行了版本回退，旧版本或者分叉版本推送到远程，需要添加 -f参数，表示强制覆盖。

* * *

### 远程操作

1.  **`git remote -v`**

    -   查看当前仓库关联的所有远程仓库及其地址。
2.  **`git remote add <name> <url>`**

    -   添加新的远程仓库，使用指定的名称（如 `origin`）。
3.  **`git fetch <remote>`**

    -   从远程仓库获取更新但不合并，可以单独检查远程分支的更改。
4.  **`git push <remote> <branch>`**

    -   将本地分支推送到远程仓库。
    -   使用 `--force` 可以强制推送（谨慎使用，以防覆盖他人提交）。
5.  **`git pull <remote> <branch>`**

    -   从远程仓库获取并合并更新到当前分支。
6.  **`git clone <url>`**

    -   从远程仓库克隆整个项目到本地，创建一个包含远程仓库链接的副本。

## 记录一些自己在日常使用场景中遇到的问题

### 1\. **高效管理工作流**：

**基于 `upstream` 的 `develop` 分支创建分支，并将变更推送到 `origin` :**

从主项目的 `develop` 分支上拉取了最新代码，并且要基于此进行开发。完成修改后，希望将代码推送到自己仓库的 `origin` 远程仓库，随后提交 PR 以合并到主项目的 `develop`。

**操作步骤:**

1.  添加远程仓库：首先确认远程仓库的配置，以确保有 `upstream` 指向主项目仓库。

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git remote add upstream &lt;主项目仓库地址&gt;  <span class="comment"># 添加远程项目</span></span><br><span class="line">git fetch upstream                        <span class="comment"># 拉取远程分支更新</span></span><br></pre></td></tr></tbody></table>

2.  从 `upstream` 更新本地分支：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git checkout develop</span><br><span class="line">git pull upstream develop                 <span class="comment"># 拉取主项目最新的 develop 分支代码</span></span><br></pre></td></tr></tbody></table>

3.  创建新分支：

    -   在本地的 `develop` 分支上创建新功能分支（如 `feature-xyz`）。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git checkout -b feature-xyz</span><br></pre></td></tr></tbody></table>

4.  提交代码并推送至 `origin`：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br></pre></td><td class="code"><pre><span class="line">git add .                                 <span class="comment"># 添加修改</span></span><br><span class="line">git commit -m <span class="string">"Add feature XYZ"</span>           <span class="comment"># 提交修改</span></span><br><span class="line">git push origin feature-xyz               <span class="comment"># 推送到 origin 远程仓库</span></span><br></pre></td></tr></tbody></table>

5.  创建 PR：

    -   在 GitHub 上打开 PR，将 `origin` 的 `feature-xyz` 分支合并至主项目的 `develop` 分支。

* * *

### 2\. 使用 `squash` 合并提交记录

当完成了某个功能的开发，但过程中有多个不必要的中间提交，为保持提交记录的简洁，可以在合并时使用 `squash` 将多个提交压缩为一个。

1.  **多次提交的检查**：

    -   使用 `git log` 查看提交历史，确认需要压缩的提交数量。
2.  **交互式 rebase**：

    -   使用交互式 rebase 合并提交。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git rebase -i HEAD~n  <span class="comment"># n 为想 squash 的提交数量</span></span><br></pre></td></tr></tbody></table>

    -   将除了第一个提交外的所有提交前缀改为 `squash`（或缩写 `s`）。
3.  **修改提交信息**：

    -   合并后，Git 会打开编辑器，让你为压缩的提交编写新的提交说明。确保信息完整并清晰。
4.  **推送更改**：

    -   如果已经将这些提交推送到远程仓库，可能需要使用 `--force` 强制推送。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git push origin feature-branch --force</span><br></pre></td></tr></tbody></table>


* * *

### 3\. `rebase` 和 `merge` 的使用区别

在多人协作开发中，代码整合往往需要处理不同分支的合并。`rebase` 和 `merge` 是两种主要的合并方法，但它们的应用场景和效果不同。`merge` 会保留提交历史，适合较大的历史分支合并；`rebase` 则用于保持提交记录简洁、线性，更适合功能分支的整合。理解这两者的差异并灵活使用可以避免提交历史的冗杂和冲突的复杂化。

**使用 `merge` 合并场景：保留原始的提交历史，如主分支合并功能分支。**

1.  拉取主分支最新代码：

    -   确保 `main` 上没有新的变更，以避免冲突。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git checkout main</span><br><span class="line">git pull origin main</span><br></pre></td></tr></tbody></table>

2.  合并功能分支：

    -   将功能分支（如 `feature-xyz`）合并至 `main`。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git merge feature-xyz</span><br></pre></td></tr></tbody></table>

3.  推送更改：

    -   推送到远程仓库，并保持功能分支独立的提交记录。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git push origin main</span><br></pre></td></tr></tbody></table>


_结果_：使用 `merge` 保留了分支开发的提交记录，适合在主分支中查看开发历史。

* * *

**使用 `rebase` 合并：场景：让功能分支的提交记录与主分支保持线性历史。适合希望将多个提交压缩并避免产生多余合并节点的场景。**

1.  拉取主分支最新代码：

    <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git checkout main</span><br><span class="line">git pull origin main</span><br></pre></td></tr></tbody></table>

2.  切换到功能分支并执行 `rebase`：

    -   使用 `rebase` 将 `feature-xyz` 更新到最新的 `main`。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git checkout feature-xyz</span><br><span class="line">git rebase main</span><br></pre></td></tr></tbody></table>

3.  解决冲突并继续：

    -   如果遇到冲突，按提示解决冲突并继续。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">git add &lt;file&gt;  <span class="comment"># 标记冲突已解决</span></span><br><span class="line">git rebase --<span class="built_in">continue</span></span><br></pre></td></tr></tbody></table>

4.  推送更改：

    -   推送时需使用 `--force` 覆盖远程分支。

        <table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">git push origin feature-xyz --force-with-lease</span><br></pre></td></tr></tbody></table>


    > `--force-with-lease` 是一种更安全的强制推送方式，它会检查远程仓库的分支是否已经被其他人更新过。如果没有被其他人更新过，它才会进行推送，避免无意中覆盖他人的工作。


_结果_：`rebase` 将分支历史线性化，保持主分支清晰简洁，适合功能开发的合并。

* * *

> 使用`rebase`的注意事项：
>
> **避免在共享分支上使用**：当一个分支已经被推送到远程仓库并且其他人可能基于它进行工作时，不要使用 `rebase`，因为它会重写历史，导致其他人需要强制同步。

记录一次`rebase`的翻车事故：

> 提交的pr被我关闭了几天，这期间仓库有了新的提交。我基于原来提交pr的分支加了新的提交，然后使用`rebase`，再force push到自己的仓库，然后试着重新打开pr的时候，打不开了 `the main branch was force-pushed or recreated`
