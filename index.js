#!/usr/bin/env node

const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const projectName = process.argv[2];

if (!projectName) {
  console.log("USAGE: create-zkwasm-app <project-name>");
  exit(1);
}

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

const templateDir = path.resolve(__dirname, "template");
fs.cpSync(templateDir, projectDir, { recursive: true });

fs.renameSync(
  path.join(projectDir, "gitignore"),
  path.join(projectDir, ".gitignore")
);

const projectPackageJson = require(path.join(projectDir, "package.json"));

// Update the project's package.json with the new project name
projectPackageJson.name = projectName;

fs.writeFileSync(
  path.join(projectDir, "package.json"),
  JSON.stringify(projectPackageJson, null, 2)
);

process.chdir(projectDir);
spawn.sync("npm", ["install"], { stdio: "inherit" });
spawn.sync("npm", ["install", "--prefix", "wasm"], { stdio: "inherit" });
spawn.sync("npm", ["install", "--prefix", "www"], { stdio: "inherit" });

console.log(`Created zkWasm app '${projectName}' at ${projectDir}`);
console.log(`\nTo get started:
    cd ${projectName}
    npm run dev
`);
