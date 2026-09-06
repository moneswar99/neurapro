import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function readFileSafe(relPath) {
  try {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    return `// File not found: ${relPath}`;
  } catch (err) {
    return `// Error reading file ${relPath}: ${err.message}`;
  }
}

const files = [
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'RecruitmentBackendApplication.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/RecruitmentBackendApplication.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'SecurityConfig.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/config/SecurityConfig.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'UserController.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/controller/UserController.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'ApplicantController.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/controller/ApplicantController.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'User.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/entity/User.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'ApplicantEntity.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/entity/ApplicantEntity.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'UserRepository.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/repository/UserRepository.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'ApplicantRepository.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/repository/ApplicantRepository.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'UserService.java',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/service/UserService.java',
    lang: 'java'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'application.properties',
    path: 'backend/src/main/resources/application.properties',
    lang: 'properties'
  },
  {
    category: '1. Backend (Spring Boot & MySQL)',
    title: 'pom.xml',
    path: 'backend/pom.xml',
    lang: 'xml'
  },
  {
    category: '2. Email & Serverless API',
    title: 'api/send-email.js',
    path: 'api/send-email.js',
    lang: 'javascript'
  },
  {
    category: '2. Email & Serverless API',
    title: 'vite.config.ts',
    path: 'vite.config.ts',
    lang: 'typescript'
  },
  {
    category: '3. Frontend Services & Types',
    title: 'recruitment.ts',
    path: 'src/types/recruitment.ts',
    lang: 'typescript'
  },
  {
    category: '3. Frontend Services & Types',
    title: 'api.ts (BackendApiService)',
    path: 'src/services/api.ts',
    lang: 'typescript'
  },
  {
    category: '3. Frontend Services & Types',
    title: 'db.ts (DatabaseService)',
    path: 'src/services/db.ts',
    lang: 'typescript'
  },
  {
    category: '3. Frontend Services & Types',
    title: 'email.ts (EmailService)',
    path: 'src/services/email.ts',
    lang: 'typescript'
  },
  {
    category: '4. Frontend Components',
    title: 'App.tsx',
    path: 'src/App.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'AdminDashboard.tsx',
    path: 'src/components/AdminDashboard.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'ApplicationForm.tsx',
    path: 'src/components/ApplicationForm.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'RoleSelectionSection.tsx',
    path: 'src/components/RoleSelectionSection.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'StatusTracker.tsx',
    path: 'src/components/StatusTracker.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'EmailInboxDrawer.tsx',
    path: 'src/components/EmailInboxDrawer.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'Header.tsx',
    path: 'src/components/Header.tsx',
    lang: 'tsx'
  },
  {
    category: '4. Frontend Components',
    title: 'Footer.tsx',
    path: 'src/components/Footer.tsx',
    lang: 'tsx'
  }
];

let md = `# NeuraMorphix Recruitment 2026 — Complete Project Source Codes\n\n`;
md += `This document contains the complete source code for both the **Frontend (React 19 + TypeScript + Vite)** and **Backend (Java 25 + Spring Boot 4.1.1 + MySQL)**.\n\n`;

let currentCat = '';
files.forEach((f) => {
  if (f.category !== currentCat) {
    currentCat = f.category;
    md += `\n---\n\n# ${currentCat}\n\n`;
  }
  const content = readFileSafe(f.path);
  md += `### 📄 ${f.title} (\`${f.path}\`)\n\n\`\`\`${f.lang}\n${content}\n\`\`\`\n\n`;
});

fs.writeFileSync(path.join(rootDir, 'NeuraMorphix_Documentation.md'), md, 'utf8');
console.log('Markdown documentation created successfully.');
