# Global Super Hero — Real-time 3D battle upgrade

This update preserves the existing game flow: create two custom-named heroes, preview five powers for each, Player 1 selects one numbered power (1–5), Player 2 selects one numbered power (1–5), then the players release the attack. Power strength affects the winner and damage. Health reaches zero to end the match.

## What changed
- Replaced the old static-image battle panel and brief shake effect with a live Three.js 3D arena.
- Added procedural 3D armored fighters, an arena floor/rings, skyline, lighting, shadows, idle motion, attack lunges, energy projectiles, collision particles, hit recoil/fall animation, and recovery.
- The chosen power names and colors are carried into the battle scene; fire, solar, frost, shadow, cosmic, shield, and gravity powers have distinct projectile colors.
- Kept custom hero names, five numbered choices, sequential player turns, health, round progression, and winner screen.

## Runtime requirement
The Three.js ES module is loaded from jsDelivr in `index.html` (Three.js 0.160.0). The deployed site therefore needs internet access to load that CDN module. If it does not load, the arena shows an engine-load message rather than a functioning 3D scene.

## Important asset limitation
The fighters in this first playable upgrade are procedurally assembled 3D armored characters, not detailed, professionally rigged hero models. Their combat animation is driven by the scene code. For a premium Tekken-level finish, replace these procedural fighters with licensed/custom GLB/GLTF characters that include skeletal rigs and punch, kick, block, hit, knockdown, and recovery animation clips. The existing 2D hero images remain the selection portraits.

## Deploy
Commit the changed files to GitHub and let Netlify redeploy. No Supabase migration or database change is needed for this front-end battle upgrade.
