# Global Super Hero — real-time 3D two-player fighting mode

The Global Super Hero mode now uses a live side-view 3D arena with two keyboard-controlled fighters. It replaces the previous turn-based power-selection/clash flow.

## Player controls

| Action | Player 1 (blue) | Player 2 (red) |
|---|---|---|
| Move left/right | A / D | Left / Right arrows |
| Jump | W | Up arrow |
| Punch | F | J |
| Kick | G | K |
| Special power | H | L |
| Pause / resume | Esc | Esc |

## Combat features
- Procedurally modeled 3D armored humanoid fighters with separate torso, head, arms, forearms, legs, boots, armor plates, masks, hair/helmet details, shoulder pieces and capes.
- Side-on fighting camera, 3D arena floor, ring markings, futuristic skyline, lighting, shadows and colored energy pylons.
- Real-time movement, jumping, gravity, punch and kick animations, close-range hit checks, damage, hit stun, knockback, airborne reactions and landing.
- Special energy projectiles with impact particles and knockback. Energy recharges over time; special attacks consume 35 energy.
- Health bars, energy meters, match timer, pause overlay and winner result.
- Character names and hero choices remain editable in the existing Global Punjabi Game Arena.

## Runtime requirement
Three.js 0.160.0 is loaded as an ES module from jsDelivr by `index.html`. The deployed site therefore needs internet access to load this CDN module. If it does not load, the arena displays an engine-load message.

## Model / animation limitation
The fighters are procedural 3D models built from Three.js geometry and animated through articulated scene groups. They are not licensed AAA character assets or professionally motion-captured skeletal GLB/GLTF characters. The battle is playable and interactive, but a premium commercial fighting-game finish would require custom rigged character models, animation clips, and additional hitbox/animation polish.

## Deploy
Commit the changed files to GitHub and let Netlify redeploy. No Supabase migration or database change is required for this front-end fighting-mode update.
