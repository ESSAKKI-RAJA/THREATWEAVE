import fs from "fs";
import path from "path";

const map = {
  "bg-\\[#0b1220\\]": "bg-background",
  "bg-\\[#111827\\]": "bg-surface-container",
  "bg-\\[#0f172a\\]": "bg-surface",
  "border-\\[#1f2937\\]": "border-outline-variant",
  "bg-\\[#1f2937\\]": "bg-outline-variant",
  "text-\\[#94a3b8\\]": "text-on-surface-variant",
  "text-\\[#3b82f6\\]": "text-primary",
  "bg-\\[#3b82f6\\]": "bg-primary",
  "hover:bg-\\[#1f2937\\]": "hover:bg-outline-variant",
  "hover:bg-\\[#111827\\]": "hover:bg-surface-container",
  "hover:bg-\\[#0f172a\\]": "hover:bg-surface",
  "hover:text-\\[#3b82f6\\]": "hover:text-primary",
  "placeholder-\\[#94a3b8\\]": "placeholder-on-surface-variant",
  "focus:border-\\[#3b82f6\\]": "focus:border-primary",
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let original = content;

      for (const [key, value] of Object.entries(map)) {
        const regex = new RegExp(key, "g");
        content = content.replace(regex, value);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.resolve("./src"));
console.log("Done");
