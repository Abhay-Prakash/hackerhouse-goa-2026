const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\bliss\\.gemini\\antigravity\\brain\\90d626e0-953d-4fd0-a60e-e9457b876462\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' && data.content && data.content.includes('from PIL import Image, ImageDraw')) {
      fs.writeFileSync('python_source.txt', data.content);
      console.log('Saved to python_source.txt');
    }
  } catch (e) {}
}
