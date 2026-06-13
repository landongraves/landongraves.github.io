export const SERVICES = [
  {
    id: "01",
    title: "Hard Surface",
    description:
      "Purpose-built props and product forms with readable silhouettes, controlled topology, and believable construction.",
  },
  {
    id: "02",
    title: "Materials",
    description:
      "Surface work that gives each asset history and weight, from worn metal and polymer to presentation-grade finishes.",
  },
  {
    id: "03",
    title: "Presentation",
    description:
      "Lighting, turntables, and interactive showcases designed to prove the model works from every angle.",
  },
];

export const CAPABILITIES = [
  "Modeling",
  "Texturing",
  "Product visuals",
  "Game assets",
  "Lighting",
];

export const MODEL_STUDIES = [
  {
    id: "precision-rifle",
    title: "Precision Rifle",
    description:
      "A hard-surface study focused on layered materials, manufactured detail, and a silhouette that remains readable at distance.",
    mode: "textured",
  },
  {
    id: "precision-rifle-wireframe",
    title: "Structure / Wire",
    description:
      "The same asset stripped to its construction, exposing the topology and form decisions beneath the finished surface.",
    mode: "wireframe",
  },
];

export const ESTIMATE_OPTIONS = {
  scope: [
    { label: "1 small item", price: 600 },
    { label: "1 medium item", price: 1200 },
    { label: "1 large item", price: 2200 },
    { label: "3-item set", price: 3200 },
  ],
  detail: [
    { label: "Low poly", price: 0 },
    { label: "Medium poly", price: 700 },
    { label: "High poly", price: 1800 },
  ],
  timeline: [
    { label: "2 weeks", price: 0 },
    { label: "1 week", price: 900 },
    { label: "4 days", price: 2200 },
  ],
  materialsPrice: 1800,
};

export const EXPERIENCE = [
  {
    label: "Practice",
    title: "Independent 3D Artist",
    skill: "Client-focused production",
    description:
      "Transforms reference material and rough ideas into clear, presentation-ready hard-surface assets.",
  },
  {
    label: "Workflow",
    title: "Blender",
    skill: "Modeling and materials",
    description:
      "Owns the process from blockout and topology through UVs, materials, lighting, and final presentation.",
  },
  {
    label: "Delivery",
    title: "Production Ready",
    skill: "Flexible outputs",
    description:
      "Prepares clean deliverables for games, product visualization, campaigns, and interactive web experiences.",
  },
];
