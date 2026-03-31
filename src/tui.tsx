import { BuddyWidget } from "./BuddyWidget.tsx";

export default {
  tui: async (api) => {
    // 1. Register the component in the TUI Slots (above prompt or bottom bar)
    // The exact slot name ('home_prompt' / 'home_bottom') depends on OpenCode SDK.
    api.slots.register({
      home_prompt: () => <BuddyWidget />
    });

    // 2. Register Slash Commands for interacting with the Buddy
    api.command.register(() => [
      {
        title: "Feed Buddy",
        value: "feed_buddy",
        description: "Give your terminal buddy a snack to boost happiness.",
        category: "Opencode Buddy",
        slash: {
          name: "buddyfeed",
          aliases: ["bf"]
        },
        onSelect: () => {
          // Play a happy notification
          api.ui.toast({
            title: "Buddy",
            message: "Yum! Buddy ate the snack and is happier 😊",
            variant: "success",
          });
          
          // Future: we could save the feed state in KV
          const lastFed = (api.kv.get("buddy-last-fed") as number) || 0;
          api.kv.set("buddy-last-fed", Date.now());
        }
      },
      {
        title: "Pet Buddy",
        value: "pet_buddy",
        description: "Pet your terminal buddy.",
        category: "Opencode Buddy",
        slash: {
          name: "buddypet",
        },
        onSelect: () => {
          api.ui.toast({
            title: "Buddy",
            message: "Buddy purrs happily 🐾",
            variant: "info",
          });
        }
      }
    ]);
  }
};
