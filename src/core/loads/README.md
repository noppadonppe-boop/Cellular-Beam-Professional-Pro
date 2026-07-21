# Straight Beam Loads

Phase 6 implements load case and diagram generation for straight simply supported benchmark beams.

Implemented scope:

- load case metadata and categories
- UDL and point load records
- automatic steel self-weight from area, density, and standard gravity
- break-point generation for point loads and partial UDL boundaries
- FEM model assembly for straight simply supported beams
- reaction, shear, bending moment, rotation, and deflection diagram samples
- benchmark cases for UDL and centre point load

Not implemented:

- standard-based load combinations
- envelopes and pattern loading
- trapezoidal or triangular loads
- support settlement
- moving loads
- persistent Firestore analysis runs

All analysis values are SI canonical values and are rounded only at display boundaries.
