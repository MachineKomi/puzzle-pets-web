# Sudoku UI Polish & Feedback Plan (Round 2)

This document outlines the detailed plan to address the latest feedback for the Sudoku UI, animations, and game loop elements.

## 1. Pet Companion Integration
**Feedback:** The currently equipped pet should join the puzzle, placed above the number pad. It should react to success (hop) and mistakes (shake) and have a speech bubble.
**Plan:**
- **Create `PuzzleCompanion.tsx`:** A new component that reads the currently active pet from the global state/store.
- **State & Animations:** Add states for `idle`, `happy` (success), and `sad` (mistake). Tie these states to Tailwind keyframe animations (e.g., `animate-bounce` for happy, `animate-shake` for sad).
- **Speech Bubble:** Implement a timed dialogue system that cycles through encouraging phrases ("You got this!", "Hmm, let's think...", "Wow, great move!") and reacts to game events.
- **Layout Integration:** Place this component in `SudokuEngine.tsx` directly above the `NumberPad` within the right-hand control column.

## 2. Gem Scaling and Visibility
**Feedback:** Gems are still tiny and difficult to see within the grid.
**Plan:**
- **Analyze Asset Padding:** The actual `gem` PNG assets likely contain a large amount of transparent padding. Since resizing the DOM element container to `w-[90%]` didn't work, the icon itself is probably small relative to its canvas.
- **Targeted CSS Scaling:** Instead of just increasing the container width, apply a direct transform scale (e.g., `scale-150` or `transform: scale(1.5)`) to the `Icon` component specifically inside the Sudoku grid cells to visually bloat the gem without distorting the layout.
- **Verification:** Ensure the scaling doesn't cause overflow clipping issues by adjusting `overflow-hidden` properties on the cell buttons if necessary.

## 3. Targeted Placement Effects (Removing JS-Confetti Fullscreen)
**Feedback:** Placements should have a localized sparkling explosion and a brief flash. The current fullscreen emoji shower on single placements is ugly and unwanted.
**Plan:**
- **Remove `js-confetti` Fullscreen Shower:** Remove the `js-confetti` library call for standard placements.
- **Localized Sparkle Effect:** Create a reusable `ParticleBurst.tsx` component (or use a lightweight library like `framer-motion` or canvas particles) that is rendered absolutely on top of the `SudokuGrid` when a cell is placed. The colors of the particles will be passed dynamically based on the gem placed.
- **Temporary Flash Animation:** Introduce a new CSS class `.animate-gem-flash` that temporarily swaps in the `_glowing` sprite and pulses for 1.5 seconds upon correct placement, then reverts to the standard sprite.

## 4. Line/Square Completion: Particle Streams & EXP
**Feedback:** Completed lines/squares should explode with colored particles that stream toward the Pet Companion to grant EXP.
**Plan:**
- **Particle Pathing:** When a line/square completes, calculate the screen coordinates of the completed cells and the screen coordinates of the `PuzzleCompanion` bounding box.
- **CSS / Framer Motion Animation:** Spawn colored orbs/particles at the completed cells and animate them along a bezier curve towards the pet's coordinates.
- **EXP Integration:** Upon the particles reaching the pet, trigger the a +EXP float text above the pet and call the reward engine's logic to increment the pet's experience in the global store.

## 5. Post-Game Rewards Framework
**Feedback:** Completing puzzles should award Gold (for food/toys) and Gems (for the Gacha system). 
**Plan:**
- **Reward Engine Update:** Expand the existing 'Coins/XP' logic to specifically grant 'Gold' and 'Premium Gems' based on difficulty and performance (mistakes made).
- **Results Modal UI Update:** Update the `PuzzleResultsModal.tsx` to beautifully display exactly how much Gold and how many Gems were earned upon victory.
- **Wallet Store Connection:** Ensure these rewarded currencies push to the persistence layer (`activeProfile.wallet.gold` and `activeProfile.wallet.gems`).
