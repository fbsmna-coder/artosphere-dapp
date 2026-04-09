/// All 13 Artosphere Discovery NFTs — 1:1 with Zenodo concept records
/// DOIs are latest versions, verified via Zenodo API 2026-04-09

export interface DiscoveryInfo {
  id: number;
  title: string;
  formula: string;
  category: "D" | "S" | "P";
  status: string;
  doi: string;
  paper: string; // Short label
}

export const DISCOVERIES: DiscoveryInfo[] = [
  {
    id: 0,
    title: "28 Standard Model Parameters from Golden Ratio",
    formula: "v_EW = M_Pl / φ^(719/9)",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19481854",
    paper: "Papers I-II",
  },
  {
    id: 1,
    title: "Structural Derivations from V_Art",
    formula: "ξ_Art(s) = ξ_Art(1-s)",
    category: "D",
    status: "PROVEN",
    doi: "10.5281/zenodo.19469471",
    paper: "Paper III",
  },
  {
    id: 2,
    title: "Gravity Hierarchy & Dark Energy",
    formula: "w₀ = -1 + 1/φ⁸",
    category: "D",
    status: "CONFIRMED",
    doi: "10.5281/zenodo.19469469",
    paper: "Paper IV",
  },
  {
    id: 3,
    title: "Complete Derivation Program (28 Parameters)",
    formula: "D=8, S=10, E=10, Δ̄=0.58%",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19469909",
    paper: "Paper V",
  },
  {
    id: 4,
    title: "The Artosphere: Monograph v7.0",
    formula: "2 inputs (φ + M_Pl) → 35 outputs",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19475900",
    paper: "Monograph",
  },
  {
    id: 5,
    title: "Solar Neutrino Mixing from A₅ in Cl(6)",
    formula: "sin²θ₁₂ = 1/(2φ) = 0.30902",
    category: "S",
    status: "CONFIRMED",
    doi: "10.5281/zenodo.19472827",
    paper: "JUNO Letter",
  },
  {
    id: 6,
    title: "Fibonacci Fusion in Z₃-graded Cl(6)",
    formula: "τ⊗τ = 1⊕τ → V_Art is a theorem",
    category: "D",
    status: "PROVEN",
    doi: "10.5281/zenodo.19473026",
    paper: "Phase 2",
  },
  {
    id: 7,
    title: "Z Boson Mass as Spectral Eigenvalue",
    formula: "M_Z = f(M_Pl, φ) ± 0.12%",
    category: "D",
    status: "PROVEN",
    doi: "10.5281/zenodo.19473552",
    paper: "Phase 4",
  },
  {
    id: 8,
    title: "Complete EW Spectrum from φ & M_Pl",
    formula: "M_W, M_Z, M_H, M_χ",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19473762",
    paper: "L4 Spectrum",
  },
  {
    id: 9,
    title: "The Two-Parameter Universe",
    formula: "L_Art = √(-g)[R/2 + L_gauge + ψ̄Dψ - V_Art]",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19474044",
    paper: "Paper VI",
  },
  {
    id: 10,
    title: "Z-Boson Mass from Planck Scale + φ",
    formula: "M_Z = M_Pl·φ^(-1393/18)/√(8(8φ-3))",
    category: "D",
    status: "PROVEN",
    doi: "10.5281/zenodo.19480597",
    paper: "Paper VI-b",
  },
  {
    id: 11,
    title: "Higgs-Flavor Identity: M_H + J_CP",
    formula: "λ=(π+6φ⁹)/(24πφ⁸), M_H=125.251 GeV (0.0007%)",
    category: "D",
    status: "PROVEN",
    doi: "10.5281/zenodo.19480973",
    paper: "Paper VII",
  },
  {
    id: 12,
    title: "Master Lagrangian v1.2 (31/31 PASS)",
    formula: "L_Art(φ, M_Pl) → 31 observables, 100% pass",
    category: "S",
    status: "SUPERSEDED",
    doi: "10.5281/zenodo.19481524",
    paper: "Master v1.2",
  },
  {
    id: 13,
    title: "Paper VIII: Artosphere Cosmology",
    formula: "V_inf = V_Art(s_inf), δ_CP = arctan(√5), θ_QCD = 0",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19482718",
    paper: "Paper VIII",
  },
  {
    id: 14,
    title: "Master Action v2.0: 36 Parameters",
    formula: "S_Art[g,A,ψ,s] → 36 observables (SM+DM+DE+cosmo), 0 free params",
    category: "S",
    status: "PROVEN",
    doi: "10.5281/zenodo.19482719",
    paper: "Master v2.0",
  },
];

export const DISCOVERY_TITLES: Record<number, string> = Object.fromEntries(
  DISCOVERIES.map((d) => [d.id, d.title])
);

export const DISCOVERY_DOIS: Record<number, string> = Object.fromEntries(
  DISCOVERIES.map((d) => [d.id, d.doi])
);

export const TOTAL_DISCOVERIES = DISCOVERIES.length;
