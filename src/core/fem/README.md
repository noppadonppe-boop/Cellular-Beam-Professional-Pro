# Finite Element Analysis

Phase 5 implements a deterministic 2D linear elastic frame solver inside the pure TypeScript engineering core.

Implemented scope:

- Euler-Bernoulli frame element with 3 DOF per node: `ux`, `uy`, `rz`
- dense global stiffness assembly
- nodal load vector assembly
- local uniform element load vector assembly
- support restraints by DOF
- Gaussian elimination with partial pivoting
- restrained-node reaction recovery
- local element end-force recovery
- benchmark helpers for simply supported and cantilever beams

Not implemented:

- nonlinear material or geometric analysis
- plate/shell/opening stress concentration
- cellular opening Vierendeel checks
- web-post buckling checks
- weld design
- design-code utilization

All values are SI canonical values and no intermediate analysis values are rounded.
