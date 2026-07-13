/**
 * SVG 转 base64 data URI 生成脚本
 * 读取 src/images/*.svg，转成 base64 data URI，输出到 src/data/svg-data.ts
 * 每次替换 SVG 素材后需重新运行：node scripts/gen-svg-data.js
 */
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'src', 'images');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'svg-data.ts');

const files = {
  youmiao: 'seedlingSvg',
  xiangshu: 'oakSvg',
  yinxingshu: 'ginkgoSvg',
  yinghuashu: 'cherrySvg',
  yezishu: 'palmSvg',
  fenghuangmu: 'flameSvg',
  dingxiangshu: 'lilacSvg',
};

let output = '// 自动生成：SVG 转 base64 data URI，请勿手动编辑\n';
output += '// 运行 node scripts/gen-svg-data.js 重新生成\n\n';

for (const [name, varName] of Object.entries(files)) {
  const filePath = path.join(imagesDir, `${name}.svg`);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] 文件不存在: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath);
  const base64 = content.toString('base64');
  output += `export const ${varName} = 'data:image/svg+xml;base64,${base64}';\n`;
  console.log(`[OK] ${name}.svg -> ${Math.round(base64.length / 1024)}KB base64`);
}

fs.writeFileSync(outputFile, output, 'utf-8');
console.log(`\n已生成: ${outputFile}`);
