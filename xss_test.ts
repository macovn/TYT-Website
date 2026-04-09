
import { sanitizeHtml } from './src/lib/utils';

const input = "<script>alert('hack')</script><p>Hello</p><img src=x onerror=alert(1)>";
const output = sanitizeHtml(input);

console.log('--- XSS TEST ---');
console.log('Input:', input);
console.log('Output:', output);

if (output.includes('<script>') || output.includes('onerror')) {
  console.log('RESULT: FAIL (JS detected)');
} else {
  console.log('RESULT: PASS (Cleaned)');
}
