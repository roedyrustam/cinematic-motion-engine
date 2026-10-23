# Living Cartoon Stage (`kartun-panggung`), Head Expression Generator & After Effects MCP Bridge
## Panduan Kartun Panggung Hidup, Generator Ekspresi Kepala & Jembatan MCP After Effects

---

## 1. The `kartun-panggung` Living Stage Architecture

In `kartun-panggung` mode, the video is a **full-color theatrical 2D/2.5D animated story** — not an infographic with floating text boxes.

### The 5 Golden Rules of `kartun-panggung`:
1. **Zero Captions on Stage**: Do not put subtitle boxes, bullet points, or floating headlines in the sky. All text in a cartoon stage must be **100% diegetic** (printed on a shop sign, a chalkboard, a wooden crate, or a newspaper held by a character).
2. **Ban Miniature Wide Shots (`zoom 1.08–1.95`)**:
   - Never leave the camera at `zoom < 1.0` showing tiny characters lost in a giant empty room.
   - Frame characters in medium-wide (`zoom 1.08–1.30`) or medium-closeup (`zoom 1.35–1.95`) so their expressions and limb gestures read clearly.
3. **Minimum 10 Moving Elements per Stage (`>= 10` Living Props)**:
   - A stage feels dead if only the speaking character's mouth moves.
   - Every stage must include **at least 10 simultaneous motion loops** (deterministic sine/cosine functions of `tl.time()`):
     1. Character A torso breathing (`sy: 1 + Math.sin(t*3)*0.015`)
     2. Character A arm gesturing (`J(armR).r`)
     3. Character A blinking / talking head swap (`swapHead(t)`)
     4. Character B reactive head nod / idle weight shift
     5. Background clouds drifting (`x = t * 18`)
     6. Midground tree canopies swaying (`rotate = Math.sin(t*1.8)*2.5`)
     7. Hanging lantern / sign swinging (`rotate = Math.cos(t*2.4)*4`)
     8. Foreground grass blades / bushes rustling
     9. Ambient dust motes / fireflies / birds crossing
     10. Prop activity (boiling kettle steam, spinning fan, clock pendulum, or passing vehicle).
4. **Separate Placement `<g>` from Animated Joint `<g>`**:
   - Always nest animated limbs inside a static coordinate placement group:
     ```xml
     <!-- Static placement at shoulder coordinate (45, -110) -->
     <g transform="translate(45, -110)">
       <!-- Animated joint driven by J(el, 0, 0) pivoting cleanly around (0,0) -->
       <g id="hero-arm-r">
         <rect x="-10" y="0" width="20" height="78" rx="10" fill="#E07A5F"/>
         <!-- Elbow placement at (0, 70) -->
         <g transform="translate(0, 70)">
           <g id="hero-forearm-r">
             <rect x="-8" y="0" width="16" height="68" rx="8" fill="#F2CC8F"/>
           </g>
         </g>
       </g>
     </g>
     ```
5. **Deterministic Walk, Talk & Blink Cycles**:
   - Compute walk cycles as pure functions of `t`:
     ```javascript
     function updateWalkCycle(rig, t, freq = 2.6, amp = 28) {
       const phase = t * freq * Math.PI * 2;
       rig.legL.r     =  Math.sin(phase) * amp;
       rig.legR.r     = -Math.sin(phase) * amp;
       rig.kneeL.r    =  Math.max(0, -Math.cos(phase)) * (amp * 0.85);
       rig.kneeR.r    =  Math.max(0,  Math.cos(phase)) * (amp * 0.85);
       rig.armL.r     = -Math.sin(phase) * (amp * 0.75);
       rig.armR.r     =  Math.sin(phase) * (amp * 0.75);
       rig.torso.ty   = -Math.abs(Math.cos(phase)) * 8;
       rig.head.r     =  Math.sin(phase * 0.5) * 3.5;
     }
     ```

---

## 2. Local Character Head Expression & Viseme Generator (`scripts/kepala-ekspresi.py`)

When the user provides a character face image (`tokoh.png`) or wants expressive talking/blinking heads without external API calls:
- Run `python scripts/kepala-ekspresi.py tokoh.png ./heads/`
- Generates 6 deterministic transparent PNG variants using local Pillow/OpenCV affine & morphological transforms:
  1. `head-neutral.png` (Base open eyes, closed mouth)
  2. `head-blink.png` (Closed eyelids for 0.12s blink intervals every 3.2s)
  3. `head-talk-small.png` (Slightly open mouth for consonants)
  4. `head-talk-wide.png` (Open vowel mouth driven by `AUDIO_FRAMES` mid-frequency energy)
  5. `head-happy.png` (Raised cheeks / warm squint)
  6. `head-surprised.png` (Widened eyes + tilted brow)

---

## 3. After Effects MCP Bridge (`ae_*`) & Higgsfield / AI Video Loop Workflow

When the user has an **After Effects MCP Server** active or requests `.aep` native layers alongside the web engine:

### 3.1 Converting SVG Stage Assets into Native After Effects Shape Layers
1. Design and verify the vector props/characters in clean SVG (`viewBox="0 0 1920 1080"`).
2. Use the AE MCP bridge tools (`ae_create_comp`, `ae_add_shape_layer`, `ae_set_keyframes`) to translate `#world` camera coordinates and `J()` joint rotations directly into After Effects 3D Null Camera (`Cam_Controller`) and puppet/rotation keyframes:
   - Map `into()` (`expo.in`) to AE incoming spatial/temporal bezier influence `[85%, 0.1]`.
   - Map `settle()` (`expo.out`) to AE outgoing bezier influence `[0.1, 90%]`.

### 3.2 Integrating AI Video Loop Plates (Higgsfield / Kling / Runway / Veo)
When combining generative AI video backgrounds with razor-sharp kinetic typography:
1. Never bake typography inside the AI video generator (AI video generators garble small text and violate the 1080p legibility floor).
2. Generate clean **looping environment plates** (e.g., camera push through a server room, paper textures unfolding, isometric clay diorama) and load them into `#world` using the deterministic `clip({ src: 'plate.mp4', el: '#bg-video' })` helper.
3. Composite crisp DOM/SVG kinetic typography, callout leader lines, and data charts on top of the video plate inside `#world` so both layers share camera shake, rack focus, and motion blur.
