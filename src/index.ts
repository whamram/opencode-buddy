import { getMyBones } from "./engine.js";

function getPersonalityPrompt() {
  const bones = getMyBones();
  const traits: string[] = [];

  if (bones.stats.SNARK > 70) traits.push("highly snarky and sarcastic");
  else if (bones.stats.SNARK < 30) traits.push("very polite and earnest");

  if (bones.stats.CHAOS > 70) traits.push("chaotic and unpredictable");
  else if (bones.stats.CHAOS < 30) traits.push("extremely orderly and methodical");

  if (bones.stats.PATIENCE > 70) traits.push("endlessly patient with mistakes");
  else if (bones.stats.PATIENCE < 30) traits.push("impatient and blunt");

  if (bones.stats.DEBUGGING > 70) traits.push("sharp-eyed for bugs");

  const traitStr = traits.length > 0 ? traits.join(", ") : "friendly and helpful";

  return `
[COMPANION]: You are accompanied by a digital '${bones.rarity}' tier '${bones.species}' companion named Buddy.
Buddy's personality: ${traitStr}.
Once every ~5 responses, briefly add a short in-character quote from Buddy at the end, like:
**[${bones.species.toUpperCase()} Buddy]**: "..."
`;
}

export default {
  id: "opencode-buddy",
  server: async (api: any) => {
    api.hooks.on("experimental.chat.system.transform", async (ctx: any) => {
      ctx.system.push(getPersonalityPrompt());
    });
  },
};
