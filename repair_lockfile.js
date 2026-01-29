const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'package-lock.json');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for the pattern where the file seems to restart
  // The pattern is the end of the valid JSON followed by the start of the garbage
  // End of valid JSON: "}\n  }\n}"
  // Start of garbage: "\n\n  "lockfileVersion": 3,"
  
  // Find all occurrences of "lockfileVersion": 3
  const searchStr = '"lockfileVersion": 3';
  let indices = [];
  let idx = content.indexOf(searchStr);
  while (idx !== -1) {
    indices.push(idx);
    idx = content.indexOf(searchStr, idx + 1);
  }

  console.log(`Found ${indices.length} occurrences of "${searchStr}"`);

  if (indices.length > 1) {
      // The second occurrence is likely the start of the garbage
      const garbageStartIdx = indices[1];
      console.log(`Garbage likely starts around index ${garbageStartIdx}`);
      
      // Look backwards from garbageStartIdx to find the last closing brace '}'
      const lastBraceIdx = content.lastIndexOf('}', garbageStartIdx);
      
      if (lastBraceIdx !== -1) {
          console.log(`Found last brace at index ${lastBraceIdx}`);
          const fixedContent = content.substring(0, lastBraceIdx + 1);
          
          try {
            JSON.parse(fixedContent);
            console.log('Fixed content is valid JSON.');
            fs.writeFileSync(filePath, fixedContent);
            console.log('package-lock.json has been repaired.');
          } catch (e) {
            console.error('Error: Truncated content is not valid JSON.', e.message);
            // Maybe we cut too much or too little?
            // Let's try to find the brace before that?
            // Or maybe the garbage starts earlier?
          }
      } else {
          console.log('Could not find a closing brace before the garbage.');
      }
  } else {
      console.log('Could not find duplicate lockfileVersion. Checking for other patterns.');
      // Maybe the garbage doesn't contain lockfileVersion?
      // But the user report says it does.
      
      // Let's try to find the sequence "}\n}\n\n" regardless of what follows
      // But we need to be careful not to match inside the file if it's valid.
      // A valid package-lock.json shouldn't have double newlines between closing braces usually, but it might.
      
      // Let's print the end of the file to see what's going on
      console.log('End of file content (last 500 chars):');
      console.log(content.slice(-500));
  }

} catch (err) {
  console.error('An error occurred:', err);
}
