import { createSignal, onCleanup, onMount } from "solid-js";
import { getMyBones } from "./engine.js";
import { renderSprite } from "./sprites.js";

// Colors mapped to rarities for styling
const RARITY_COLORS = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400 font-bold",
};

export function BuddyWidget() {
  const [frame, setFrame] = createSignal(0);
  const [isAsleep, setIsAsleep] = createSignal(false);
  const bones = getMyBones();
  
  // Fidget animation interval
  onMount(() => {
    const interval = setInterval(() => {
      if (!isAsleep()) {
        setFrame((f) => f + 1);
      }
    }, 1000); // 1 second per frame
    
    onCleanup(() => clearInterval(interval));
  });

  const lines = () => renderSprite(bones, frame());

  return (
    <div class="flex flex-col ml-2 my-2 select-none">
      <div class={`text-xs mb-1 ${RARITY_COLORS[bones.rarity]}`}>
        Lvl 1 {bones.species.toUpperCase()} [{bones.rarity}]
      </div>
      <div>
        {lines().map((line, index) => (
          <div key={index} class="font-mono whitespace-pre text-sm leading-none opacity-80">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
