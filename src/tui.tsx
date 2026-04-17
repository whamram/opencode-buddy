import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { BuddyWidget } from "./BuddyWidget.tsx";
import { exportBuddy, importBuddy } from "./buddy-file.js";

export default {
  id: "opencode-buddy-tui",
  tui: async (api: any) => {
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
        title: "Feed Buddy",
        value: "feed_buddy",
        description: "Give your terminal buddy a snack",
        category: "Opencode Buddy",
        slash: { name: "buddyfeed", aliases: ["bf"] },
        onSelect: () => {
          api.ui.toast({ title: "Buddy", message: "Yum!", variant: "success" });
        },
      },
      {
        title: "Pet Buddy",
        value: "pet_buddy",
        description: "Pet your terminal buddy",
        category: "Opencode Buddy",
        slash: { name: "buddypet" },
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
          const owner = os.userInfo().username || "defaultUser";
          const data = exportBuddy(owner);
          if (!data) {
            api.ui.toast({ title: "Buddy", message: "No buddy file found to export", variant: "error" });
            return;
          }
          const outPath = path.join(os.homedir(), ".config", "opencode-buddy", `${owner}.buddy.json`);
          api.ui.toast({ title: "Buddy Exported", message: outPath, variant: "success" });
        },
      },
      {
        title: "Import Buddy",
        value: "import_buddy",
        description: "Import buddy from ~/.config/opencode-buddy/incoming.buddy.json",
        category: "Opencode Buddy",
        slash: { name: "buddyimport", aliases: ["bimp"] },
        onSelect: () => {
          const owner = os.userInfo().username || "defaultUser";
          const incomingPath = path.join(os.homedir(), ".config", "opencode-buddy", "incoming.buddy.json");
          const result = importBuddy(incomingPath, owner);
          if (result.ok) {
            try { fs.unlinkSync(incomingPath); } catch {}
            api.ui.toast({ title: "Buddy Imported", message: "Restart opencode to see your new buddy", variant: "success" });
          } else {
            const hint = result.error + ". Place the file at: " + incomingPath;
            api.ui.toast({ title: "Import Failed", message: hint, variant: "error" });
          }
        },
      },
    ]);
  },
};