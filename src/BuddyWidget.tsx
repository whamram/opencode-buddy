import { createSignal, onCleanup, onMount } from "solid-js";
import { getMyBones } from "./engine.js";
import { renderSprite } from "./sprites.js";

const RARITY_COLOR: Record<string, string> = {
  common: "white",
  uncommon: "green",
  rare: "cyan",
  epic: "magenta",
  legendary: "yellow",
};

export function BuddyWidget() {
  const [frame, setFrame] = createSignal(0);
  const bones = getMyBones();

  onMount(() => {
    const interval = setInterval(() => {
      setFrame((f) => f + 1);
    }, 1200);
    onCleanup(() => clearInterval(interval));
  });

  const lines = () => renderSprite(bones, frame());
  const color = RARITY_COLOR[bones.rarity] ?? "white";

  return (
    <box flexDirection="column" alignItems="center" paddingLeft={0} paddingBottom={0} paddingTop={0}>
      <text color={color}>
        {bones.name}
      </text>
      {lines().map((line) => (
        <text>{line}</text>
      ))}
    </box>
  );
}
