export interface EcosystemMetrics {
  gain: string;
  netChange: string;
  naturalPercent: number;
  nonNaturalPercent: number;
}

export const mockEcosystemData: Record<string, EcosystemMetrics> = {
  "net-change": { gain: "+451ha", netChange: "+5.3%", naturalPercent: 86.5, nonNaturalPercent: 13.5 },
  water:        { gain: "+518ha", netChange: "+6.1%", naturalPercent: 89.2, nonNaturalPercent: 10.8 },
  forest:       { gain: "+423ha", netChange: "+4.9%", naturalPercent: 91.5, nonNaturalPercent:  8.5 },
  forest_gain:  { gain: "+485ha", netChange: "+5.7%", naturalPercent: 88.1, nonNaturalPercent: 11.9 },
  sand:         { gain: "+392ha", netChange: "+4.6%", naturalPercent: 82.8, nonNaturalPercent: 17.2 },
  sand_gain:    { gain: "+467ha", netChange: "+5.5%", naturalPercent: 85.3, nonNaturalPercent: 14.7 },
  shrub:        { gain: "+411ha", netChange: "+4.8%", naturalPercent: 90.2, nonNaturalPercent:  9.8 },
  shrub_gain:   { gain: "+498ha", netChange: "+5.9%", naturalPercent: 87.6, nonNaturalPercent: 12.4 },
};

export interface Publication {
  id: string;
  title: string;
}

export const mockPublications: Publication[] = [
  { id: "pub-1", title: "Qualidade da água durante a formação de lago em cava de mina: estudo de caso do lago de Águas Claras" },
  { id: "pub-2", title: "Qualidade da água em lagos de mineração - estudos de caso: Águas Claras e Riacho dos Machados" },
  { id: "pub-3", title: "Determinação do balanço hídrico na recuperação do nível de água do aquífero Cauê na Mina de Águas Claras, Serra do Curral, Município de Nova Lima, Minas Gerais" },
  { id: "pub-4", title: "Geoquímica e gênese das formações ferríferas bandadas e do minério de ferro da Mina de Águas Claras, Quadrilátero Ferrífero, MG" },
  { id: "pub-5", title: "Alterações químicas e sanitárias em solos e estéril de mineração para fins de recuperação ambiental" },
  { id: "pub-6", title: "O caso da Mina de Águas Claras, Nova Lima, Brasil" },
  { id: "pub-7", title: "Uso Futuro de Áreas Mineradas e o Meio Urbano — includes a dedicated MAC case study and mine-closure/future-use analysis." },
  { id: "pub-8", title: "Formation of a deep pit lake: case study of Aguas Claras, Brazil" },
  { id: "pub-9", title: "Mineralogy and trace-element geochemistry of the high-grade iron ores of the Águas Claras Mine and comparison with the Capão Xavier and Tamanduá iron ore deposits, Quadrilátero Ferrífero, Brazil" },
];
