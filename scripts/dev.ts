import fs from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";

if (process.platform !== "darwin") throw new Error("This script is only for macOS");

import thena from "thena/node";

if (!process.env.HOME) {
    throw new Error("HOME environment variable is not set");
}

const aeroPluginsDir = path.join(process.env.HOME, "Library/Application Support/aero/plugins");

watch(path.join(process.cwd(), "plugins"), { recursive: true }, async (eventType, filename) => {
    if (!filename) return;

    if (eventType === "change") {
        thena.log(`File ${filename} changed`, thena.ASCII.magenta);

        await fs.copyFile(path.join(process.cwd(), "plugins", filename), path.join(aeroPluginsDir, filename));

        thena.log(`Copied ${filename} to aero directory.`, thena.ASCII.yellow);
    }
});
