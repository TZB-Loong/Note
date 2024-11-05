<!--
 * @Author: long
 * @Date: 2024-11-03 09:38:18
 * @LastEditors: long
 * @LastEditTime: 2024-11-03 09:38:30
 * @Description:
-->

# HBuilderX 连接 MuMu 模拟器

## 1. 下载并安装 MuMu 模拟器

首先，你需要下载并安装 MuMu 模拟器。可以从官方网站下载：[MuMu 模拟器官网](http://mumu.163.com/)。下载完成后，直接安装即可。

## 2. 配置环境变量

确保 Android SDK 中的`adb`工具已添加到系统环境变量，或者按照 IDE（如 HBuilderX）的提示进行配置。你可以在系统的“高级系统设置”内打开环境变量，找到系统变量内的`Path`变量并点击编辑，添加你的`adb`路径。路径不需要指定到`adb.exe`，只需到其上级目录即可。

## 3. 配置 HBuilderX

打开 HBuilderX，点击“工具” > “配置” > “运行配置”。在“运行配置”对话框中，填入`Android SDK`、`Android NDK`和`Java SDK`的安装路径。同时，配置`adb`路径和模拟器端口号。对于 MuMu 模拟器，端口号通常为 7555。

## 4. 使用 ADB 连接模拟器

打开终端（CMD），输入命令`adb connect 127.0.0.1:7555`来连接 MuMu 模拟器。连接成功后，输入`adb devices`查看已连接设备，确认模拟器是否已成功连接。

## 5. 运行项目到模拟器

在 HBuilderX 中打开你需要运行的项目。点击工具栏上的“运行”按钮，选择“真机调试”。此时，HBuilderX 会自动扫描并连接到 MuMu 模拟器。如果连接成功，你就可以在模拟器上看到你的应用界面。

## 6. 开始真机调试

一旦连接成功，你就可以在 HBuilderX 中进行真机调试了。你可以设置断点、单步执行代码、查看变量值等。如果需要查看更详细的调试信息，可以在 Android Studio 的调试工具窗口中查看。

## 注意事项

- 确保电脑和模拟器连接在同一局域网内。
- 尝试重启 HBuilderX 和 MuMu 模拟器。
- 检查`ADB Network Port`是否设置正确。
- 确保已在 MuMu 模拟器中启用“Enable ADB over Network”选项。
- 检查 LogCat 窗口是否已打开。
