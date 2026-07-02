const fs = require('fs');
const path = require('path');

const seederPath = path.join(__dirname, 'src', 'utils', 'seeder.js');
let content = fs.readFileSync(seederPath, 'utf8');

// Match tags to determine organizer
const topCompanies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Tesla'];

content = content.replace(/(\{\s*title: ".*?)[,]/g, (match, p1) => {
  return match;
});

const lines = content.split('\n');
let newLines = [];
let currentCompany = null;

for (let i = 0; i < lines.length; i++) {
  newLines.push(lines[i]);
  if (lines[i].includes('tags: [')) {
    // try to find company in tags
    topCompanies.forEach(company => {
      if (lines[i].includes(`"${company}"`)) {
        currentCompany = company;
      }
    });
  }
  
  if (lines[i].includes('description: "') && !lines[i-1].includes('organizer:')) {
    // Determine organizer
    let organizerStr = '';
    let descriptionLine = lines[i];
    
    topCompanies.forEach(c => {
      if (descriptionLine.includes(c) || (i > 0 && lines[i-1].includes(c))) {
        organizerStr = `    organizer: "${c}",\n`;
      }
    });
    
    if (organizerStr) {
      newLines.splice(newLines.length - 1, 0, organizerStr.trimEnd());
    }
  }
}

// Write roughly back
// Actually, safer string replace:

let newContent = fs.readFileSync(seederPath, 'utf8');
topCompanies.forEach(c => {
    // Simple naive insert before description if title contains company
    const regex = new RegExp(`(title: ".*${c}.*",\\s+)description:`, 'g');
    newContent = newContent.replace(regex, `$1organizer: "${c}",\n    description:`);
    
    const regexTags = new RegExp(`(tags: \\["${c}".*?\\],\\s+)eligibility:`, 'g');
    newContent = newContent.replace(regexTags, `$1organizer: "${c}",\n    eligibility:`);
});

fs.writeFileSync(seederPath, newContent);
console.log("Updated seeder.js successfully");
