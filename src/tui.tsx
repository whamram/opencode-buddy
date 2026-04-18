import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { createEffect, createSignal } from "solid-js";
import { BuddyWidget } from "./BuddyWidget.tsx";
import { exportBuddy, importBuddy } from "./buddy-file.js";

export default {
  id: "opencode-buddy-tui",
  tui: async (api: any) => {
    const [pendingExport, setPendingExport] = createSignal<string | null>(null);
    const [pendingImport, setPendingImport] = createSignal<true | null>(null);

    createEffect(() => {
      const data = pendingExport();
      if (!data) return;
      setPendingExport(null);
      const owner = `${os.userInfo().username || "defaultUser"}@${os.hostname() || "localhost"}`;
      api.ui.dialog.replace(() => (
        <api.ui.DialogPrompt
          title="Export Buddy"
          description={() => <text>Choose a directory to export your buddy file to</text>}
          placeholder="~/Downloads"
          onConfirm={(dir: string) => {
            const resolved = dir.replace(/^~/, os.homedir());
            try {
              fs.mkdirSync(resolved, { recursive: true });
              const outPath = path.join(resolved, `${owner}.buddy.json`);
              fs.writeFileSync(outPath, data, "utf-8");
              api.ui.dialog.clear();
              api.ui.toast({ title: "Buddy Exported", message: outPath, variant: "success", duration: 15000 });
            } catch (err: any) {
              api.ui.toast({ title: "Export Failed", message: err.message, variant: "error", duration: 15000 });
            }
          }}
          onCancel={() => { api.ui.dialog.clear(); }}
        />
      ));
    });

    createEffect(() => {
      if (!pendingImport()) return;
      setPendingImport(null);
      const owner = `${os.userInfo().username || "defaultUser"}@${os.hostname() || "localhost"}`;
      api.ui.dialog.replace(() => (
        <api.ui.DialogPrompt
          title="Import Buddy"
          description={() => <text>Enter the path to a buddy JSON file to import</text>}
          placeholder="~/Downloads/buddy.buddy.json"
          onConfirm={(filePath: string) => {
            const resolved = filePath.replace(/^~/, os.homedir());
            const result = importBuddy(resolved, owner);
            if (result.ok) {
              api.ui.dialog.clear();
              api.ui.toast({ title: "Buddy Imported", message: "Restart opencode to see your new buddy", variant: "success", duration: 15000 });
            } else {
              api.ui.toast({ title: "Import Failed", message: result.error, variant: "error", duration: 15000 });
            }
          }}
          onCancel={() => { api.ui.dialog.clear(); }}
        />
      ));
    });

    api.slots.register({
      order: 50,
      slots: {
        home_bottom() {
          return <BuddyWidget />;
        },
        sidebar_footer() {
          return <BuddyWidget />;
        },
      },
    });

    api.command.register(() => [
      {
        title: "Pet Buddy",
        value: "pet_buddy",
        description: "Pet your terminal buddy",
        category: "Opencode Buddy",
        slash: { name: "pet" },
        onSelect: () => {
          api.ui.toast({ title: "Buddy", message: "Purrrr", variant: "info" });
        },
      },
      {
        title: "Export Buddy",
        value: "export_buddy",
        description: "Export your buddy file for transfer",
        category: "Opencode Buddy",
        slash: { name: "buddyexport", aliases: ["bexp"] },
        onSelect: () => {
          const owner = `${os.userInfo().username || "defaultUser"}@${os.hostname() || "localhost"}`;
          const data = exportBuddy(owner);
          if (!data) {
            api.ui.toast({ title: "Buddy", message: "No buddy file found to export", variant: "error", duration: 15000 });
            return;
          }
          setPendingExport(data);
        },
      },
      {
        title: "Import Buddy",
        value: "import_buddy",
        description: "Import a buddy file from another machine",
        category: "Opencode Buddy",
        slash: { name: "buddyimport", aliases: ["bimp"] },
        onSelect: () => {
          setPendingImport(true);
        },
      },
    ]);
  },
};