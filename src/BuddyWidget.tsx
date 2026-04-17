import { createSignal, onCleanup, onMount } from "solid-js";
import { getMyBones } from "./engine.js";
import { renderSprite, renderCorrupted } from "./sprites.js";

const RARITY_COLOR: Record<string, string> = {
  common: "white",
  uncommon: "green",
  rare: "cyan",
  epic: "magenta",
  legendary: "yellow",
};

export function BuddyWidget() {
  const [frame, setFrame] = createSignal(0);
  const result = getMyBones();

  onMount(() => {
    const interval = setInterval(() => {
      setFrame((f) => f + 1);
    }, 1200);
    onCleanup(() => clearInterval(interval));
  });

  if (result.corrupted) {
    const lines = () => renderCorrupted(frame());

    return (
      <box flexDirection="column" alignItems="center" paddingLeft={0} paddingBottom={0} paddingTop={0}>
        <text color="red">
          CORRUPTED
        </text>
        {lines().map((line) => (
          <text color="red">{line}</text>
        ))}
        <text color="red">
          data tampered — re-hatch or import
        </text>
      </box>
    );
  }

  const bones = result.bones;
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