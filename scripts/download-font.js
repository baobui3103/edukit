// Script để download font NotoSans TTF tự động
// Chạy: node scripts/download-font.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Dùng raw.githubusercontent.com trực tiếp - đáng tin cậy hơn
const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans-Regular.ttf';
const outputDir = path.join(__dirname, '..', 'public', 'fonts');
const outputFile = path.join(outputDir, 'NotoSans-Regular.ttf');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Đang download font NotoSans-Regular.ttf từ GitHub...');

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      // Kiểm tra status code
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        // Follow redirect
        return downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
      
      // Kiểm tra Content-Type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('font') && !contentType.includes('octet-stream') && !contentType.includes('application')) {
        console.warn(`⚠️  Cảnh báo: Content-Type không phải font: ${contentType}`);
      }
      
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        // Kiểm tra magic bytes để đảm bảo là TTF
        const buffer = fs.readFileSync(outputPath);
        const magicBytes = buffer.slice(0, 4);
        const magicHex = magicBytes.toString('hex').toUpperCase().match(/.{2}/g)?.join(' ') || '';
        
        // TTF magic bytes: 00 01 00 00 hoặc 74 72 75 65 (true)
        // OTF magic bytes: 4F 54 54 4F (OTTO)
        if (magicHex.startsWith('00010000') || magicHex.startsWith('74727565') || magicHex.startsWith('4F54544F')) {
          console.log('✅ Download thành công! Font đã được lưu tại:', outputPath);
          console.log(`   File size: ${(buffer.length / 1024).toFixed(2)} KB`);
          console.log(`   Magic bytes: ${magicHex} (valid TTF/OTF)`);
          resolve();
        } else {
          fs.unlinkSync(outputPath);
          reject(new Error(`File không phải font hợp lệ. Magic bytes: ${magicHex}`));
        }
      });
      
      file.on('error', (err) => {
        fs.unlinkSync(outputPath);
        reject(err);
      });
    }).on('error', reject);
  });
}

downloadFile(fontUrl, outputFile).catch((err) => {
  console.error('❌ Lỗi khi download:', err.message);
  console.log('\n📥 Vui lòng download thủ công:');
  console.log('1. Truy cập: https://fonts.google.com/noto/specimen/Noto+Sans');
  console.log('2. Click "Download family"');
  console.log('3. Giải nén file ZIP');
  console.log('4. Copy file NotoSans-Regular.ttf từ thư mục unzipped vào public/fonts/');
  process.exit(1);
});

