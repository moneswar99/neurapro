import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

const filesToInclude = [
  // Backend
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Spring Boot Main Application',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/RecruitmentBackendApplication.java',
    lang: 'java',
    desc: 'Main entry point for the Spring Boot recruitment backend application.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Security & CORS Configuration',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/config/SecurityConfig.java',
    lang: 'java',
    desc: 'Spring Security filter chain configuring CORS allow-all headers and open public API endpoints.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'User Authentication Controller',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/controller/UserController.java',
    lang: 'java',
    desc: 'REST controller handling admin/recruiter registration and login (/api/users/login, /api/users/register).'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Applicant Controller',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/controller/ApplicantController.java',
    lang: 'java',
    desc: 'REST controller handling candidate application submissions, retrieving applicants, and updating statuses (/api/applicants).'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'User JPA Entity',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/entity/User.java',
    lang: 'java',
    desc: 'Database entity mapping to the MySQL "users" table.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Applicant JPA Entity',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/entity/ApplicantEntity.java',
    lang: 'java',
    desc: 'Database entity mapping to the MySQL "applicants" table.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'User Repository',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/repository/UserRepository.java',
    lang: 'java',
    desc: 'Spring Data JPA repository for user lookup by email.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Applicant Repository',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/repository/ApplicantRepository.java',
    lang: 'java',
    desc: 'Spring Data JPA repository for applicant lookup by application ID and email.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'User Authentication Service',
    path: 'backend/src/main/java/com/neuramorphix/recruitment_backend/service/UserService.java',
    lang: 'java',
    desc: 'Business logic for verifying admin/recruiter passwords during login.'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Application Properties Configuration',
    path: 'backend/src/main/resources/application.properties',
    lang: 'properties',
    desc: 'Database connection properties (MySQL URL, username, password, JPA Hibernate ddl-auto).'
  },
  {
    category: 'Backend (Spring Boot & MySQL)',
    title: 'Maven Project Descriptor (pom.xml)',
    path: 'backend/pom.xml',
    lang: 'xml',
    desc: 'Maven build configuration containing Spring Boot, Spring Security, JPA, and MySQL dependencies.'
  },

  // API & Email Server
  {
    category: 'Email & Serverless API',
    title: 'Vercel Serverless Email Function',
    path: 'api/send-email.js',
    lang: 'javascript',
    desc: 'Serverless Node.js endpoint using Nodemailer to send branded recruitment emails via Gmail SMTP.'
  },
  {
    category: 'Email & Serverless API',
    title: 'Vite Configuration & Dev Nodemailer Plugin',
    path: 'vite.config.ts',
    lang: 'typescript',
    desc: 'Vite build config with Tailwind CSS, local network exposure (--host), and dev /api/send-email middleware.'
  },

  // Frontend Services & Types
  {
    category: 'Frontend Services & Types',
    title: 'TypeScript Recruitment Types',
    path: 'src/types/recruitment.ts',
    lang: 'typescript',
    desc: 'TypeScript interface definitions for Applicant, Role, EmailLog, AdminUser, and EmailSettings.'
  },
  {
    category: 'Frontend Services & Types',
    title: 'Backend API Integration Service',
    path: 'src/services/api.ts',
    lang: 'typescript',
    desc: 'Client API service bridging frontend components to Spring Boot backend (/api/users and /api/applicants).'
  },
  {
    category: 'Frontend Services & Types',
    title: 'Database & LocalStorage Service',
    path: 'src/services/db.ts',
    lang: 'typescript',
    desc: 'Manages local seed data, 10 recruitment teams, admin credentials, recruitment timeline, and localStorage persistence.'
  },
  {
    category: 'Frontend Services & Types',
    title: 'Email Dispatch Service',
    path: 'src/services/email.ts',
    lang: 'typescript',
    desc: 'Client-side email generator that handles template interpolation and triggers the /api/send-email endpoint.'
  },

  // Frontend Components
  {
    category: 'Frontend Components',
    title: 'Main App Component',
    path: 'src/App.tsx',
    lang: 'tsx',
    desc: 'Root component managing page navigation (Apply, Teams, Status Tracker, Admin Portal).'
  },
  {
    category: 'Frontend Components',
    title: 'Admin Dashboard Component',
    path: 'src/components/AdminDashboard.tsx',
    lang: 'tsx',
    desc: 'Full administrative portal with live recruitment analytics, candidate table, status change modals, and email template customization.'
  },
  {
    category: 'Frontend Components',
    title: 'Candidate Application Form Component',
    path: 'src/components/ApplicationForm.tsx',
    lang: 'tsx',
    desc: 'Multi-step applicant registration form with Indian Colleges autocomplete, 10-digit phone validator, and confetti celebration.'
  },
  {
    category: 'Frontend Components',
    title: 'Role Selection Component',
    path: 'src/components/RoleSelectionSection.tsx',
    lang: 'tsx',
    desc: 'Interactive role selector displaying all 10 recruitment teams with primary and optional secondary preference picking.'
  },
  {
    category: 'Frontend Components',
    title: 'Status Tracker Component',
    path: 'src/components/StatusTracker.tsx',
    lang: 'tsx',
    desc: 'Applicant status search bar and dynamic timeline showing progress from submission to acceptance.'
  },
  {
    category: 'Frontend Components',
    title: 'Live Email Inbox Drawer Component',
    path: 'src/components/EmailInboxDrawer.tsx',
    lang: 'tsx',
    desc: 'Floating drawer displaying live previews of sent emails in real-time.'
  },
  {
    category: 'Frontend Components',
    title: 'Header Navigation Component',
    path: 'src/components/Header.tsx',
    lang: 'tsx',
    desc: 'Top navbar with logo, recruitment countdown timer, and portal status badge.'
  },
  {
    category: 'Frontend Components',
    title: 'Footer Component',
    path: 'src/components/Footer.tsx',
    lang: 'tsx',
    desc: 'Footer containing NeuraMorphix links, admin portal lock button, and copyright info.'
  },
  {
    category: 'Frontend Components',
    title: 'NeuraMorphix Logo Component',
    path: 'src/components/NeuraMorphixLogo.tsx',
    lang: 'tsx',
    desc: 'Custom SVG neural brain icon and branded typography component.'
  },
  {
    category: 'Frontend Components',
    title: 'Team Icons Helper',
    path: 'src/components/TeamIcons.tsx',
    lang: 'tsx',
    desc: 'Icon resolver mapping team categories to Lucide icons.'
  }
];

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NeuraMorphix - Complete Source Code & Technical Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
      font-size: 12px;
      margin: 0;
      padding: 0;
    }
    .cover {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 88vh;
      text-align: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid #38bdf8;
      border-radius: 20px;
      color: #38bdf8;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .title {
      font-size: 32px;
      font-weight: 900;
      margin: 0 0 10px 0;
      color: #ffffff;
    }
    .subtitle {
      font-size: 16px;
      color: #94a3b8;
      margin: 0 0 25px 0;
      max-width: 550px;
    }
    .meta {
      border-top: 1px solid #334155;
      padding-top: 15px;
      margin-top: 25px;
      font-size: 12px;
      color: #cbd5e1;
      width: 100%;
      max-width: 450px;
      display: flex;
      justify-content: space-between;
    }
    h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 4px;
      margin-top: 24px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14px;
      font-weight: 700;
      color: #0369a1;
      margin-top: 16px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    .file-box {
      margin-bottom: 24px;
      page-break-inside: auto;
    }
    .file-header {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-bottom: none;
      padding: 8px 12px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-after: avoid;
    }
    .file-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 12px;
    }
    .file-path {
      font-family: 'Consolas', monospace;
      color: #0284c7;
      font-size: 11px;
    }
    .file-desc {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-top: none;
      border-bottom: none;
      padding: 6px 12px;
      font-size: 11px;
      color: #475569;
      font-style: italic;
      page-break-after: avoid;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border: 1px solid #334155;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9.5px;
      line-height: 1.4;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <div class="cover">
    <div class="badge">Complete Source Code Reference</div>
    <div class="title">NeuraMorphix Recruitment 2026</div>
    <div class="subtitle">Complete Source Code & Architecture Reference Manual for Frontend (React + TypeScript) and Backend (Spring Boot + MySQL)</div>
    <div class="meta">
      <div><strong>Project:</strong> NeuraMorphix</div>
      <div><strong>Author:</strong> NeuraMorphix Dev Team</div>
      <div><strong>Date:</strong> September 2026</div>
    </div>
  </div>
`;

let currentCategory = '';

filesToInclude.forEach((file, index) => {
  if (file.category !== currentCategory) {
    if (index > 0) {
      html += `<div class="page-break"></div>`;
    }
    currentCategory = file.category;
    html += `<h1>${currentCategory}</h1>`;
  }

  const codeContent = readFileSafe(file.path);
  const escapedCode = escapeHtml(codeContent);

  html += `
  <div class="file-box">
    <div class="file-header">
      <span class="file-title">${file.title}</span>
      <span class="file-path">${file.path}</span>
    </div>
    <div class="file-desc">${file.desc}</div>
    <pre><code>${escapedCode}</code></pre>
  </div>
  `;
});

html += `
</body>
</html>
`;

fs.writeFileSync(path.join(rootDir, 'NeuraMorphix_All_Codes_Documentation.html'), html, 'utf8');
console.log('HTML documentation generated successfully.');
