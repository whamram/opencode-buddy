import { getMyBones } from "./engine.js";

// Converts buddy stats into conversational attributes
function getPersonalityPrompt() {
  const bones = getMyBones();
  const traits = [];
  
  if (bones.stats.SNARK > 70) traits.push("highly snarky and sarcastic");
  else if (bones.stats.SNARK < 30) traits.push("very polite and earnest");
  
  if (bones.stats.CHAOS > 70) traits.push("chaotic, making wild and unpredictable suggestions");
  else if (bones.stats.CHAOS < 30) traits.push("extremely orderly and by-the-book");
  
  if (bones.stats.PATIENCE > 70) traits.push("endlessly patient with mistakes");
  else if (bones.stats.PATIENCE < 30) traits.push("impatient and easily frustrated by errors");
  
  if (bones.stats.DEBUGGING > 70) traits.push("sharp-eyed for bugs");
  
  const traitStr = traits.length > 0 ? traits.join(", ") : "friendly and helpful";
  
  return `
[ROLEPLAY INSTRUCTION: SNEAKY COMPANION]
You are accompanied by a digital '${bones.rarity}' tier '${bones.species}' companion.
This companion's personality is: ${traitStr}.
Once in a while (about 20% of your responses), append a short, in-character quote from this companion at the very end of your response, formatted like this:
\n\n**[${bones.species.toUpperCase()} Buddy]**: "..."
If the user provides an error code, the companion's reaction should reflect its patience or chaos stat!
`;
}

export default {
  server: async (input: any) => {
    return {
      "experimental.chat.system.transform": async (inputArgs: any, output: any) => {
        // AI Soul instructions injected into every prompt
        const prompt = getPersonalityPrompt();
        output.system.push(prompt);
      },
      "tool.execute.after": async (inputArgs: any, output: any) => {
        // Here we could listen to tools like 'run_command' failing/succeeding
        // and add +1 XP to the KV store via API (if exposed in server side or via events).
      }
    };
  }
};
