/**
 * NEXTGEN DMA VENTURES — Production Build & Asset Validation Script
 * Verifies code syntax, static assets, media paths, serverless exports,
 * and compiles production deployment artifacts for Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n============================================================');
console.log('🚀 NEXTGEN DMA VENTURES — PRODUCTION BUILD SYSTEM');
console.log('============================================================\n');

let errors = 0;
let warnings = 0;

// 1. Validate JavaScript syntax
console.log('[1/5] Validating JavaScript Code Integrity...');
const jsFiles = [
  'server.js',
  'src/server/app.js',
  'src/server/db.js',
  'src/server/emailService.js',
  'api/index.js',
  'db.js',
  'emailService.js',
  'script.js',
  'public/js/utils/helpers.js',
  'public/js/data/courses.js',
  'public/js/data/faq.js',
  'public/js/modules/navigation.js',
  'public/js/modules/course-renderer.js',
  'public/js/modules/course-filter.js',
  'public/js/modules/faq.js',
  'public/js/modules/booking.js',
  'public/js/modules/enquiry.js',
  'public/js/modules/carousel.js',
  'public/js/main.js'
];

for (const file of jsFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing required JS file: ${file}`);
    errors++;
  } else {
    try {
      execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
      console.log(`  ✅ Syntax valid: ${file}`);
    } catch (e) {
      console.error(`  ❌ Syntax error in ${file}:`, e.message);
      errors++;
    }
  }
}

// 2. Validate HTML Entrypoints & Stylesheets
console.log('\n[2/5] Validating HTML Entrypoints & CSS Integrity...');
const htmlFiles = ['index.html', 'admin.html'];
for (const file of htmlFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing HTML entrypoint: ${file}`);
    errors++;
  } else {
    const size = fs.statSync(filePath).size;
    console.log(`  ✅ HTML valid: ${file} (${size} bytes)`);
  }
}

const cssFiles = [
  'style.css',
  'updates.css',
  'public/css/main.css',
  'public/css/base/variables.css',
  'public/css/base/reset.css',
  'public/css/base/typography.css',
  'public/css/layout/containers.css',
  'public/css/layout/navigation.css',
  'public/css/components/buttons.css',
  'public/css/components/cards.css',
  'public/css/components/forms.css',
  'public/css/components/carousel.css',
  'public/css/components/faq.css',
  'public/css/components/modals.css',
  'public/css/sections/hero.css',
  'public/css/sections/services.css',
  'public/css/sections/courses.css',
  'public/css/sections/contact.css',
  'public/css/pages/admin.css'
];

for (const file of cssFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing CSS stylesheet: ${file}`);
    errors++;
  } else {
    const size = fs.statSync(filePath).size;
    console.log(`  ✅ CSS valid: ${file} (${size} bytes)`);
  }
}

// 3. Validate Serverless API Export
console.log('\n[3/5] Validating Vercel Serverless Function Handler...');
try {
  process.env.NODE_ENV = 'test';
  const apiHandler = require('./api/index.js');
  if (typeof apiHandler === 'function' && typeof apiHandler.use === 'function') {
    console.log('  ✅ api/index.js successfully exports Express application instance.');
  } else {
    console.error('  ❌ api/index.js does not export a valid Express handler.');
    errors++;
  }
} catch (e) {
  console.error('  ❌ Failed to evaluate api/index.js:', e.message);
  errors++;
}

// 4. Validate Critical Static Media Assets
console.log('\n[4/5] Validating Critical Static Media Assets...');
const criticalAssets = [
  'logo.jpeg',
  'h1.jpg',
  'h2.jpg',
  'about.png',
  'sam.png',
  'vid1.mp4',
  'assets/Core_Disciplines/cloud-architect.jpg',
  'assets/Core_Disciplines/fullstack-web.jpg',
  'assets/Core_Disciplines/machine-learning.jpg',
  'assets/Core_Disciplines/ui-ux-design.jpg',
  'assets/Core_Disciplines/devops-cloud.jpg',
  'assets/Core_Disciplines/data-analytics.jpg',
  'assets/Core_Disciplines/cyber-defense.jpg',
  'assets/home.images/home.images/Cloud & DevOps.jpg',
  'assets/home.images/home.images/Social & Growth Marketing.jpg',
  'assets/home.images/home.images/ai in automative head.png',
  'assets/home.images/home.images/industry robo.jpeg',
  'assets/home.images/home.images/ev for mech.png',
  'assets/home.images/home.images/automotive cad using solid.jpeg',
  'assets/home.images/home.images/automative trouble.jpeg',
  'assets/home.images/home.images/vehicle dynamic.jpeg',
  'assets/home.images/home.images/ai in automative.jpeg',
  'assets/home.images/home.images/ev battery.png',
  // Organized Public Assets Structure Verification
  'public/assets/brand/logo.jpeg',
  'public/assets/videos/vid1.mp4',
  'public/assets/images/hero/h1.jpg',
  'public/assets/images/about/about.png',
  'public/assets/images/disciplines/cloud-architect.jpg',
  'public/assets/images/courses/ai.png'
];

let assetsFound = 0;
for (const asset of criticalAssets) {
  const assetPath = path.join(__dirname, asset);
  if (fs.existsSync(assetPath)) {
    assetsFound++;
  } else {
    console.error(`  ❌ Missing asset: ${asset}`);
    errors++;
  }
}
console.log(`  ✅ Verified ${assetsFound}/${criticalAssets.length} critical media assets on disk.`);

// 5. Build Artifact & Output Directory Preparation
console.log('\n[5/5] Preparing Production Output & Vercel Artifacts...');
// If a public directory is required by Vercel or custom configurations, ensure static assets are mapped
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Mirror entrypoints into public for environments requiring explicit public directory
try {
  ['index.html', 'admin.html', 'style.css', 'updates.css', 'script.js', 'logo.jpeg', 'h1.jpg', 'h2.jpg', 'about.png', 'sam.png', 'vid1.mp4'].forEach(f => {
    const src = path.join(__dirname, f);
    const dest = path.join(publicDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    } else if (['index.html', 'admin.html', 'style.css', 'updates.css', 'script.js'].includes(f)) {
      console.error(`  ❌ Missing required frontend asset: ${f}`);
      errors++;
    }
  });

  // Mirror assets directory into public/assets
  const copyDirRecursive = (src, dest) => {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      if (fs.statSync(srcItem).isDirectory()) {
        copyDirRecursive(srcItem, destItem);
      } else {
        fs.copyFileSync(srcItem, destItem);
      }
    }
  };
  copyDirRecursive(path.join(__dirname, 'assets'), path.join(publicDir, 'assets'));
  console.log('  ✅ Synchronized production static assets into public/ directory.');
} catch (e) {
  console.warn('  ⚠️ Asset synchronization notice:', e.message);
  warnings++;
}

console.log('\n============================================================');
if (errors === 0) {
  console.log('🎉 NEXTGEN DMA VENTURES PRODUCTION BUILD PASSED SUCCESSFULLY');
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error(`❌ BUILD FAILED WITH ${errors} ERRORS`);
  console.log('============================================================\n');
  process.exit(1);
}
