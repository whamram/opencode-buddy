# 👾 opencode-buddy

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/runtime-Bun-black.svg)

**opencode-buddy** is a gamified, digital companion (plugin) tailored exclusively for the `OpenCode` environment. Harnessing the exact local parameters of your machine, it hatches a unique AI-driven companion that lives inside your terminal interface.

---

## 🚀 Features

- 🎲 **Deterministic Gacha Engine:** Based on a lightning-fast `Mulberry32` PRNG, your machine will always hatch the same unique buddy. 
- 🐾 **ASCII Species & Rarities:** Collectable companions including Cats, Dragons, Ducks, Ghosts, and Robots ranging from `Common` to `Legendary`.
- ❤️ **AI Soul Injection:** Overrides `OpenCode`'s LLM system prompts. Your buddy isn't just a static picture—its generated stats (Snark, Chaos, Patience) dictate how the AI responds to your code queries!
- 🎨 **TUI Integration:** A lively, fidgeting animation widget injected directly into the OpenCode `home_prompt`.
- 🕹️ **Interactive Slash Commands:** Run `/buddy feed` or `/buddy pet` straight from your terminal to keep your companion happy.

---

## 💻 Installation

Since this is an OpenCode extension, no complex global installation is required.

### 1. Link the Plugin Locally
Clone this repository to your preferred location:
```bash
git clone https://github.com/YourUsername/opencode-buddy.git
cd opencode-buddy
bun install
```

### 2. Add to OpenCode Configuration
Open your global `opencode` config file (usually located at `~/.opencode/opencode.json` or `.opencode/config.json`) and add the absolute path to this folder in your `plugins` array:

```json
{
  "plugin": [
    "/absolute/path/to/opencode-buddy"
  ]
}
```

### 3. Restart OpenCode
Once you restart the `opencode` CLI, the TUI will dynamically load the buddy widget right above your prompt, and the AI Soul will take over! 🧠

---

## 🛠️ Usage

Simply write your code and prompt as usual! When you trigger errors, your buddy's personality will reflect in the AI's response.
You can interact with your buddy using predefined slash commands:
- `/buddypet` (or `/buddy pet`): Give your companion some affection.
- `/buddyfeed` (or `/buddy feed`): Feed your companion to refill its happiness gauge.

---

## 🔮 Roadmap / Future Enhancements
- [ ] **Global Leaderboards**: Sync XP and levels to a global cloud function.
- [ ] **Buddy Evolution**: Automatically grant rare ASCII hats when the buddy reaches level 10, 50, and 100.
- [ ] **Error Console Reactions**: If a `shell` tool execution fails, trigger an angry or sad ASCII frame dynamically.
