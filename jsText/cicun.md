## postcss 多设计稿尺寸适配方案

### postcss 配置

1. 安装 postcss 插件
   ```bash
   npm install postcss-px-to-viewport-8-plugin
   ```
2. 在项目根目录下创建 `postcss.config.cjs` 文件，并配置如下内容：
   ```js
   module.exports = ({ webpack }) => {
     return {
       plugins: {
         autoprefixer: {
           overrideBrowserslist: [
             "Android 4.1",
             "iOS 7.1",
             "Chrome > 31",
             "ff > 31",
             "ie >= 8",
             "last 10 versions", // 所有主流浏览器最近10版本用
           ],
           grid: true,
         },
         "postcss-px-to-viewport-8-plugin": {
           unitToConvert: "px",
           viewportWidth: (file) => {
             let num = 1200;
             //van是375
             if (file.indexOf("node_modules/vant") >= 0) {
               num = 375;
             }
             return num;
           },
           unitPrecision: 5, // 单位转换后保留的精度
           propList: ["*"], // 能转化为vw的属性列表
           viewportUnit: "vw", // 希望使用的视口单位
           fontViewportUnit: "vw", // 字体使用的视口单位
           selectorBlackList: ["ignore-"], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
           minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
           mediaQuery: true, // 媒体查询里的单位是否需要转换单位
           replace: true, //  是否直接更换属性值，而不添加备用属性
           exclude: [], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
           include: [], // 如果设置了include，那将只有匹配到的文件才会被转换
           landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
           landscapeUnit: "vw", // 横屏时使用的单位
           landscapeWidth: 1628, // 横屏时使用的视口宽度
         },
       },
     };
   };
   ```
