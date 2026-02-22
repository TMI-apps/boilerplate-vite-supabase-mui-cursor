#!/usr/bin/env node
/**
 * Validates app.config.json structure. Ensures the file is valid and follows
 * expected schema. Fails CI if the config is corrupted or accidentally malformed.
 *
 * Exit 0 if valid, 1 if invalid.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "app.config.json");

function main() {
  if (!fs.existsSync(configPath)) {
    console.error("validate-app-config: app.config.json not found");
    process.exit(1);
  }

  let config;
  try {
    const content = fs.readFileSync(configPath, "utf8");
    config = JSON.parse(content);
  } catch (err) {
    console.error("validate-app-config: Invalid JSON -", err.message);
    process.exit(1);
  }

  const errors = [];

  if (typeof config.version !== "string") {
    errors.push("version must be a string");
  }
  if (!config.setup || typeof config.setup !== "object") {
    errors.push("setup must be an object");
  }
  if (!config.configurations || typeof config.configurations !== "object") {
    errors.push("configurations must be an object");
  }
  if (config.setup && !Array.isArray(config.setup.enabledFeatures)) {
    errors.push("setup.enabledFeatures must be an array");
  }

  if (errors.length > 0) {
    console.error("validate-app-config: Structure validation failed:");
    errors.forEach((e) => console.error("  -", e));
    process.exit(1);
  }

  console.log("validate-app-config: OK");
  process.exit(0);
}

main();
