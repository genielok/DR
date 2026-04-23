// Brazilian bird species from local monitoring
const brazilianBirdSpecies = [
  "Cyclarhis_gujanensis",
  "Dacnis_cayana",
  "Dendrocolaptes_platyrostris",
  "Drymophila_malura",
  "Drymophila_ochropyga",
  "Dysithamnus_mentalis",
  "Elaenia_chiriquensis",
  "Eleoscytalopus_indigoticus",
  "Eucometis_penicillata",
  "Euphonia_chlorotica",
  "Euphonia_violacea",
  "Galbula_ruficauda",
  "Gallinago_undulata",
  "Gallinula_chloropus",
  "Geotrygon_montana",
  "Glaucidium_brasilianum",
  "Habia_rubica",
  "Haplospiza_unicolor",
  "Heliothryx_auritus",
  "Hemithraupis_ruficapilla",
  "Hemitriccus_diops",
  "Hemitriccus_margaritaceiventer",
  "Hemitriccus_nidipendulus",
  "Herpetotheres_cachinnans",
  "Herpsilochmus_atricapillus",
  "Herpsilochmus_rufimarginatus",
  "Hirundinea_ferruginea",
  "Hydropsalis_torquata",
  "Hylophilus_amaurocephalus",
  "Ilicura_militaris",
  "Laterallus_melanophaius",
  "Lathrotriccus_euleri",
  "Legatus_leucophaius",
  "Leptotila_rufaxilla",
  "Leptotila_verreauxi",
  "Lochmias_nematura",
  "Lurocalis_semitorquatus",
  "Mackenziaena_severa",
  "Malacoptila_striata",
  "Manacus_manacus",
  "Megaceryle_torquata",
  "Megarynchus_pitangua",
  "Megascops_choliba",
  "Micrastur_ruficollis",
  "Micrastur_semitorquatus",
  "Milvago_chimachima",
  "Mionectes_rufiventris",
  "Myiarchus_ferox",
  "Myiarchus_swainsoni",
  "Myiarchus_tyrannulus",
  "Myiobius_barbatus",
  "Myiopagis_caniceps",
  "Myiopagis_viridicata",
  "Myiophobus_fasciatus",
  "Myiornis_auricularis",
  "Myiozetetes_similis",
  "Neopelma_pallescens",
  "Nyctibius_griseus",
  "Nycticorax_nycticorax",
  "Nyctidromus_albicollis",
  "Nyctiphrynus_ocellatus",
  "Pachyramphus_castaneus",
  "Pachyramphus_polychopterus",
  "Pandion_haliaetus",
  "Patagioenas_plumbea",
  "Penelope_obscura",
  "Penelope_superciliaris",
  "Phaethornis_ruber",
  "Phyllomyias_fasciatus",
  "Phylloscartes_ventralis",
  "Piaya_cayana",
  "Picumnus_cirratus",
  "Pionus_maximiliani",
  "Pitangus_sulphuratus",
  "Platyrinchus_mystaceus",
  "Poecilotriccus_plumbeiceps",
  "Procnias_nudicollis",
  "Pulsatrix_koeniswaldiana",
  "Pygochelidon_cyanoleuca",
  "Pyriglena_leucoptera",
  "Pyroderus_scutatus",
  "Ramphastos_dicolorus",
  "Ramphastos_toco",
  "Saltator_similis",
  "Schiffornis_virescens",
  "Sclerurus_scansor",
  "Sirystes_sibilator",
  "Sittasomus_griseicapillus",
  "Spizaetus_ornatus",
  "Spizaetus_tyrannus",
  "Sporophila_falcirostris",
  "Sporophila_frontalis",
  "Sporophila_nigricollis",
  "Strix_hylophila",
  "Synallaxis_cinerascens",
  "Synallaxis_ruficapilla",
  "Syndactyla_rufosuperciliata",
  "Tachyphonus_coronatus",
  "Tangara_cyanoventris",
  "Tangara_desmaresti",
  "Tangara_seledon",
  "Tersina_viridis",
  "Thamnophilus_caerulescens",
  "Thlypopsis_sordida",
  "Thraupis_palmarum",
  "Todirostrum_poliocephalum",
  "Tolmomyias_sulphurescens",
  "Trichothraupis_melanops",
  "Troglodytes_aedon musculus",
  "Turdus_albicollis",
  "Turdus_leucomelas",
  "Turdus_rufiventris",
  "Turdus_subalaris",
  "Tyrannus_melancholicus",
  "Xiphocolaptes_albicollis",
  "Xiphorhynchus_fuscus",
  "Xolmis_velatus",
];

// Common names mapping for Brazilian birds
const commonNamesMap: Record<string, string> = {
  Cyclarhis_gujanensis: "Rufous-browed Peppershrike",
  Dacnis_cayana: "Blue Dacnis",
  Dendrocolaptes_platyrostris: "Planalto Woodcreeper",
  Drymophila_malura: "Dusky-tailed Antbird",
  Drymophila_ochropyga: "Ochre-rumped Antbird",
  Dysithamnus_mentalis: "Plain Antvireo",
  Elaenia_chiriquensis: "Lesser Elaenia",
  Eleoscytalopus_indigoticus: "White-breasted Tapaculo",
  Eucometis_penicillata: "Gray-headed Tanager",
  Euphonia_chlorotica: "Purple-throated Euphonia",
  Euphonia_violacea: "Violaceous Euphonia",
  Galbula_ruficauda: "Rufous-tailed Jacamar",
  Gallinago_undulata: "Giant Snipe",
  Gallinula_chloropus: "Common Moorhen",
  Geotrygon_montana: "Ruddy Quail-Dove",
  Glaucidium_brasilianum: "Ferruginous Pygmy-Owl",
  Habia_rubica: "Red-crowned Ant-Tanager",
  Haplospiza_unicolor: "Uniform Finch",
  Heliothryx_auritus: "Black-eared Fairy",
  Hemithraupis_ruficapilla: "Rufous-headed Tanager",
  Hemitriccus_diops: "Drab-breasted Bamboo-Tyrant",
  Hemitriccus_margaritaceiventer: "Pearly-vented Tody-Tyrant",
  Hemitriccus_nidipendulus: "Hangnest Tody-Tyrant",
  Herpetotheres_cachinnans: "Laughing Falcon",
  Herpsilochmus_atricapillus: "Black-capped Antwren",
  Herpsilochmus_rufimarginatus: "Rufous-winged Antwren",
  Hirundinea_ferruginea: "Cliff Flycatcher",
  Hydropsalis_torquata: "Scissor-tailed Nightjar",
  Hylophilus_amaurocephalus: "Gray-eyed Greenlet",
  Ilicura_militaris: "Pin-tailed Manakin",
  Laterallus_melanophaius: "Rufous-sided Crake",
  Lathrotriccus_euleri: "Euler's Flycatcher",
  Legatus_leucophaius: "Piratic Flycatcher",
  Leptotila_rufaxilla: "Gray-fronted Dove",
  Leptotila_verreauxi: "White-tipped Dove",
  Lochmias_nematura: "Sharp-tailed Streamcreeper",
  Lurocalis_semitorquatus: "Short-tailed Nighthawk",
  Mackenziaena_severa: "Tufted Antshrike",
  Malacoptila_striata: "Crescent-chested Puffbird",
  Manacus_manacus: "White-bearded Manakin",
  Megaceryle_torquata: "Ringed Kingfisher",
  Megarynchus_pitangua: "Boat-billed Flycatcher",
  Megascops_choliba: "Tropical Screech-Owl",
  Micrastur_ruficollis: "Barred Forest-Falcon",
  Micrastur_semitorquatus: "Collared Forest-Falcon",
  Milvago_chimachima: "Yellow-headed Caracara",
  Mionectes_rufiventris: "Gray-hooded Flycatcher",
  Myiarchus_ferox: "Short-crested Flycatcher",
  Myiarchus_swainsoni: "Swainson's Flycatcher",
  Myiarchus_tyrannulus: "Brown-crested Flycatcher",
  Myiobius_barbatus: "Whiskered Flycatcher",
  Myiopagis_caniceps: "Gray Elaenia",
  Myiopagis_viridicata: "Greenish Elaenia",
  Myiophobus_fasciatus: "Bran-colored Flycatcher",
  Myiornis_auricularis: "Eared Pygmy-Tyrant",
  Myiozetetes_similis: "Social Flycatcher",
  Neopelma_pallescens: "Pale-bellied Tyrant-Manakin",
  Nyctibius_griseus: "Common Potoo",
  Nycticorax_nycticorax: "Black-crowned Night-Heron",
  Nyctidromus_albicollis: "Common Pauraque",
  Nyctiphrynus_ocellatus: "Ocellated Poorwill",
  Pachyramphus_castaneus: "Chestnut-crowned Becard",
  Pachyramphus_polychopterus: "White-winged Becard",
  Pandion_haliaetus: "Osprey",
  Patagioenas_plumbea: "Plumbeous Pigeon",
  Penelope_obscura: "Dusky-legged Guan",
  Penelope_superciliaris: "Rusty-margined Guan",
  Phaethornis_ruber: "Reddish Hermit",
  Phyllomyias_fasciatus: "Planalto Tyrannulet",
  Phylloscartes_ventralis: "Mottle-cheeked Tyrannulet",
  Piaya_cayana: "Squirrel Cuckoo",
  Picumnus_cirratus: "White-barred Piculet",
  Pionus_maximiliani: "Scaly-headed Parrot",
  Pitangus_sulphuratus: "Great Kiskadee",
  Platyrinchus_mystaceus: "White-throated Spadebill",
  Poecilotriccus_plumbeiceps: "Ochre-faced Tody-Flycatcher",
  Procnias_nudicollis: "Bare-throated Bellbird",
  Pulsatrix_koeniswaldiana: "Tawny-browed Owl",
  Pygochelidon_cyanoleuca: "Blue-and-white Swallow",
  Pyriglena_leucoptera: "White-shouldered Fire-eye",
  Pyroderus_scutatus: "Red-ruffed Fruitcrow",
  Ramphastos_dicolorus: "Red-breasted Toucan",
  Ramphastos_toco: "Toco Toucan",
  Saltator_similis: "Green-winged Saltator",
  Schiffornis_virescens: "Greenish Schiffornis",
  Sclerurus_scansor: "Rufous-breasted Leaftosser",
  Sirystes_sibilator: "Sibilant Sirystes",
  Sittasomus_griseicapillus: "Olivaceous Woodcreeper",
  Spizaetus_ornatus: "Ornate Hawk-Eagle",
  Spizaetus_tyrannus: "Black Hawk-Eagle",
  Sporophila_falcirostris: "Temminck's Seedeater",
  Sporophila_frontalis: "Buffy-fronted Seedeater",
  Sporophila_nigricollis: "Yellow-bellied Seedeater",
  Strix_hylophila: "Rusty-barred Owl",
  Synallaxis_cinerascens: "Gray-bellied Spinetail",
  Synallaxis_ruficapilla: "Rufous-capped Spinetail",
  Syndactyla_rufosuperciliata: "Buff-browed Foliage-gleaner",
  Tachyphonus_coronatus: "Ruby-crowned Tanager",
  Tangara_cyanoventris: "Gilt-edged Tanager",
  Tangara_desmaresti: "Brassy-breasted Tanager",
  Tangara_seledon: "Green-headed Tanager",
  Tersina_viridis: "Swallow Tanager",
  Thamnophilus_caerulescens: "Variable Antshrike",
  Thlypopsis_sordida: "Orange-headed Tanager",
  Thraupis_palmarum: "Palm Tanager",
  Todirostrum_poliocephalum: "Gray-headed Tody-Flycatcher",
  Tolmomyias_sulphurescens: "Yellow-olive Flycatcher",
  Trichothraupis_melanops: "Black-goggled Tanager",
  "Troglodytes_aedon musculus": "Southern House Wren",
  Turdus_albicollis: "White-necked Thrush",
  Turdus_leucomelas: "Pale-breasted Thrush",
  Turdus_rufiventris: "Rufous-bellied Thrush",
  Turdus_subalaris: "Eastern Slaty Thrush",
  Tyrannus_melancholicus: "Tropical Kingbird",
  Xiphocolaptes_albicollis: "White-throated Woodcreeper",
  Xiphorhynchus_fuscus: "Lesser Woodcreeper",
  Xolmis_velatus: "White-rumped Monjita",
};

export type IUCNStatus =
  | "LC"
  | "NT"
  | "VU"
  | "EN"
  | "CR"
  | "EX"
  | "DD";



export const IUCNStatusText = {
  LC: "Least Concern",
  NT: "Near Threatened",
  VU: "Vulnerable",
  EN: "Endangered",
  CR: "Critically Endangered",
  EX: "Extinct in the Wild",
  DD: "Data Deficient",
}


export interface Species {
  id: string;
  scientificName: string;
  commonName: string;
  iucnStatus: IUCNStatus;
  imageUrl: string;
  sampleAudioUrl: string;
  detectionCount: number;
  confidence: number;
  maxConfidence: number;
  lastDetected: string;
  attribution?: string
}

export interface Campaign {
  id: string;
  name: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "processing";
  totalRecordings: number;
  processedRecordings: number;
  speciesCount: number;
  sensors: string[];
  speciesByStatus: Partial<Record<IUCNStatus, number>>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  campaignId: string;
  dataChanged?: any;
}

export interface ProcessingResult {
  id: string;
  campaignId: string;
  fileName: string;
  uploadDate: string;
  processingDate: string;
  model: "BirdNET" | "Perch" | "Custom Model" | "Map of Life";
  modelVersion: string;
  detections: number;
  status: "pending" | "processing" | "completed" | "failed";
}

// Mock campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Mina Águas Claras",
    client: "Hexagon R-Evolution",
    location: "Minas Gerais, Brazil",
    startDate: "2026-06-01",
    endDate: "2026-06-14",
    status: "completed",
    totalRecordings: 546764,
    processedRecordings: 546764,
    speciesCount: 1918,
    sensors: [
      "SNR-001",
      "SNR-002",
      "SNR-003",
      "SNR-004",
      "SNR-005",
      "SNR-006",
      "SNR-007",
      "SNR-008",
      "SNR-009",
      "SNR-010",
    ],
    speciesByStatus: {},
  },
];

// Mock species data — Group A (camp-001). Imported directly to avoid circular deps.
import { speciesData } from "./generateSpecies";

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-001",
    timestamp: "2026-04-15T10:30:00Z",
    action: "Species Verified",
    user: "Dr. Sarah Chen",
    details: "Verified California Condor detection",
    campaignId: "camp-001",
    dataChanged: { speciesId: "sp-004", verified: true },
  },
  {
    id: "audit-002",
    timestamp: "2026-04-15T09:15:00Z",
    action: "Data Uploaded",
    user: "John Martinez",
    details: "Uploaded 124 audio files from Sensor SNR-003",
    campaignId: "camp-001",
  },
  {
    id: "audit-003",
    timestamp: "2026-04-14T16:22:00Z",
    action: "Processing Completed",
    user: "System",
    details:
      "BirdNET v2.4 processing completed for batch BN-20260414",
    campaignId: "camp-001",
  },
  {
    id: "audit-004",
    timestamp: "2026-04-14T14:10:00Z",
    action: "IUCN Data Updated",
    user: "System",
    details: "Updated IUCN status from API v2026.1",
    campaignId: "camp-001",
  },
];

// Mock processing results
export const mockProcessingResults: ProcessingResult[] = [
  {
    id: "proc-001",
    campaignId: "camp-001",
    fileName: "SNR-001_20260401_060000.wav",
    uploadDate: "2026-04-15T08:00:00Z",
    processingDate: "2026-04-15T08:30:00Z",
    model: "BirdNET",
    modelVersion: "v2.4",
    detections: 12,
    status: "completed",
  },
  {
    id: "proc-002",
    campaignId: "camp-001",
    fileName: "SNR-002_20260401_060000.wav",
    uploadDate: "2026-04-15T08:05:00Z",
    processingDate: "2026-04-15T08:35:00Z",
    model: "Perch",
    modelVersion: "v1.2",
    detections: 8,
    status: "completed",
  },
];

// Helper functions
export function getIUCNColor(status: IUCNStatus): string {
  const colors: Record<IUCNStatus, string> = {
    "LC": "#4ade80",
    "NT": "#fbbf24",
    "VU": "#fb923c",
    "EN": "#f87171",
    "CR": "#dc2626",
    "EX": "#7f1d1d",
    "DD": "#94a3b8",
  };
  return colors[status];
}

export function getSpeciesByIUCN() {
  const grouped = speciesData.reduce(
    (acc, species) => {
      const status = species.iucnStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(species);
      return acc;
    },
    {} as Record<IUCNStatus, Species[]>,
  );

  return grouped;
}

export function getSpeciesStats() {
  const stats = speciesData.reduce(
    (acc, species) => {
      const status = species.iucnStatus;
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(stats).map(([name, value]) => ({
    name,
    value,
    color: getIUCNColor(name as IUCNStatus),
  }));
}