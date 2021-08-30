const fs = require('fs-extra');
const path = require('path');
const os = require("os");
const { spawnSync } = require("child_process");

const arg = process.argv[2];
if (arg === "-h" || arg === "--help") {
  console.log("Usage: npm init @zonarius/ts-node-app [dir]");
  process.exit(0);
}

const root = path.resolve(process.argv[2] ?? ".");
const appName = path.basename(root);
const packageJson = {
  name: appName,
  version: '0.1.0',
  private: true,
  scripts: {
    "start": "ts-node src/index.ts",
    "test": "jest"
  }
};

fs.ensureDirSync(root);
fs.writeFileSync(
  path.join(root, 'package.json'),
  JSON.stringify(packageJson, null, 2) + os.EOL
);

fs.copySync(path.join(__dirname, "template"), root);

const dependencies = [
  "ts-node",
  "typescript",
]

const devDependencies = [
  "jest",
  "ts-jest",
  "@types/jest",
]

const originalDirectory = process.cwd();

process.chdir(root);
spawnSync("npm", ["install", "--save", ...dependencies], {
  stdio: "inherit"
})
spawnSync("npm", ["install", "--save-dev", ...devDependencies], {
  stdio: "inherit"
})
spawnSync("npx", ["ts-jest", "config:init"], {
  stdio: "inherit"
})

process.chdir(originalDirectory);