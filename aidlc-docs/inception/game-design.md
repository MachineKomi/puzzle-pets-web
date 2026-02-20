# Game Design — Puzzle Pets

## 1) High concept
A cozy “puzzle gym” for all ages: players do short puzzle sessions to train and grow adorable pets in a friendly arena. The pets motivate continued play, but never punish the player for taking breaks.

## 2) Design pillars (non-negotiable)
1. Family trust: no ads, no manipulative monetization
2. Low commitment: short sessions; easy re-entry
3. Pre-reader friendly: shapes/colors/gems; minimal text
4. Encouraging feedback: “coach” tone; no harsh failure
5. The pet bond: pets feel like companions, not chores

## 3) Core loop
1. Choose puzzle → 2. Solve session → 3. Earn rewards → 4. Train/collect pets → 5. Unlock new puzzles/cosmetics → repeat

## 4) Session model (unifies all puzzles)
A “Session” is a single playable run of a puzzle:
- Has a seed (determinism for replay)
- Records moves (undo + analytics for balancing)
- Produces an outcome:
  - success/fail/quit
  - time, mistakes
- Emits rewards through a shared contract

## 5) Puzzle catalog philosophy
Puzzle Pets is *curated*, not infinite. Each puzzle must:
- Be teachable with minimal reading
- Be touch-friendly
- Be finishable in ~1–5 minutes at easy levels
- Share the “gem” visual vocabulary

## 6) MVP puzzles
### 6.1 Sudoku (gem sudoku)
- Gem/shape numbers for pre-readers
- 4x4 and 6x6 first (9x9 when stable)
- Notes mode
- Hint v1: naked singles with a short explanation

### 6.2 Memory Match
- Flip tiles, match pairs
- Difficulty scaling by grid size and helper options

## 7) Early VNext puzzle
### 7.1 Match game variant
Goal: “Candy-like” satisfaction but not stressful.
- Consider a “drag path” match system (Puzzle & Dragons inspiration) OR classic swap
- Minimal special tiles at first
- Strong accessibility: shapes/overlays + high contrast

## 8) Progression & rewards
### 8.1 Player progression
- Player level increases with XP from puzzle play
- Level unlocks:
  - new puzzle difficulties
  - pet slots / pet cosmetics
  - new biomes/rooms for pet arena

### 8.2 Currencies
MVP can start with:
- Coins (earned) for pet treats/cosmetics
- Stars (session rating) for progression gates
Optional later:
- Premium currency only if there is a clear ethical plan; avoid in MVP.

### 8.3 Star rating (cross-puzzle)
- 1 star: complete
- 2 stars: complete with 0 mistakes OR within generous time
- 3 stars: complete “clean” and “fast enough” (kid-friendly thresholds)

## 9) Pets & pet arena
### 9.1 Pet philosophy
- Pets never die
- No “you missed a day” punishment
- Interactions are joyful, optional

### 9.2 Pet stats (lightweight)
To connect puzzle variety to pet training, use 2–4 simple stats:
- Focus (Sudoku)
- Memory (Memory Match)
- Speed (Match game)
- Joy (general play / streak without punishment)

### 9.3 Arena hub
A cozy “room” where:
- active pet is visible
- tapping triggers cute animations
- training progress is shown as simple bars/badges

## 10) UI/UX principles
- Big buttons, minimal text, icon-first
- Touch-first layout, responsive
- Reduce clutter; kid can always “go home”
- Offer a “Zen”/low-stimulation theme toggle

## 11) Monetization stance (MVP)
- No ads
- No real-money gacha
- Optional future DLC is allowed only if clearly labeled and does not pressure or gate core play