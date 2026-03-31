import { BuddyWidget } from "./BuddyWidget.tsx";

export default {
  id: "opencode-buddy-tui",
  tui: async (api: any) => {
    api.slots.register({
      home_prompt: () => <BuddyWidget />,
    });

    api.command.register(() => [
      {
        title: "Feed Buddy",
        value: "feed_buddy",
        description: "Give your terminal buddy a snack 🍕",
        category: "Opencode Buddy",
        slash: { name: "buddyfeed", aliases: ["bf"] },
        onSelect: () => {
          api.ui.toast({ title: "Buddy", message: "Yum! 😊", variant: "success" });
        },
      },
      {
        title: "Pet Buddy",
        value: "pet_buddy",
        description: "Pet your terminal buddy 🐾",
        category: "Opencode Buddy",
        slash: { name: "buddypet" },
        onSelect: () => {
          api.ui.toast({ title: "Buddy", message: "Purrrr 🐾", variant: "info" });
        },
      },
    ]);
  },
};
