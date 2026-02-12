#!/usr/bin/env node

/**
 * Cleanup script to remove setup files after configuration is complete
 * Run with: node scripts/cleanup-setup.js
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const filesToRemove = [
  "src/pages/SetupPage.tsx",
  "src/utils/setupUtils.ts",
  "scripts/cleanup-setup.js",
];

function removeSetupFiles() {
  console.log("🧹 Cleaning up setup files...\n");

  let removedCount = 0;
  for (const file of filesToRemove) {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Error removing ${file}:`, error.message);
      }
    } else {
      console.log(`⚠️  Not found: ${file} (already removed?)`);
    }
  }

  console.log(`\n📝 Updating App.tsx...`);
  updateAppTsx();

  console.log(`\n✨ Cleanup complete! Removed ${removedCount} file(s).`);
  console.log("\n💡 Next steps:");
  console.log("   1. Review the changes to src/App.tsx");
  console.log("   2. Commit the changes to your repository");
  console.log("   3. Continue developing your app!");
}

function updateAppTsx() {
  const appPath = join(projectRoot, "src/App.tsx");
  if (!existsSync(appPath)) {
    console.error("❌ src/App.tsx not found!");
    return;
  }

  let content = readFileSync(appPath, "utf-8");

  // Remove setup-related imports
  content = content.replace(/import { SetupPage } from "@pages\/SetupPage";\s*\n/g, "");
  content = content.replace(/import { shouldShowSetup } from "\.\/utils\/setupUtils";\s*\n/g, "");

  // Remove setup check and conditional rendering
  content = content.replace(/const showSetup = shouldShowSetup\(\);\s*\n/g, "");

  // Replace the conditional setup route with just the normal routes
  // This regex matches: {showSetup ? (<Route path="*" element={<SetupPage />} />) : (<>...routes...</>)}
  content = content.replace(
    /\{\s*showSetup\s*\?\s*\(\s*<Route path="\*" element=\{<SetupPage \/>\} \/>\s*\)\s*:\s*\(\s*<>/g,
    ""
  );
  content = content.replace(/<\/>\s*\)\s*\}/g, "");

  // Clean up extra blank lines (3+ newlines become 2)
  content = content.replace(/\n{3,}/g, "\n\n");

  // Ensure proper formatting
  content = content.replace(/\s+</g, "\n<");
  content = content.replace(/>\s+</g, ">\n<");

  writeFileSync(appPath, content, "utf-8");
  console.log("✅ Updated src/App.tsx");
}

// Run cleanup
removeSetupFiles();
