import { useState, useEffect } from "react";
import {
  Leaf,
  AlertTriangle,
  RadioTower,
  MapPin,
  Activity,
} from "lucide-react";
import { type Campaign, type Species } from "../../../data/mockData";
import { getSpeciesByCampaign, getSpeciesBySensor } from "@/api";
import { AllDetectionsModal } from "./AllDetectionsModal";
import { StatCard } from "./StatCard";
import { IucnDonutChart } from "./IucnDonutChart";
import { SpeciesList } from "./SpeciesList";
import { ImageLightbox } from "./ImageLightbox";
import { STATUS_ORDER, IUCN_COLORS } from "../const";

export interface SensorInfo {
  sensorId: string;
  habitat: string;
  batteryLevel: number;
  coordinates: string;
  elevation: string;
}

interface OverviewTabProps {
  project: Campaign;
  sensorInfo?: SensorInfo;
  sensorId?: string;
}

export function OverviewTab({
  project,
  sensorInfo,
  sensorId,
}: OverviewTabProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  useEffect(() => {
    if (sensorId) {
      getSpeciesBySensor(sensorId).then(setSpecies);
    } else {
      getSpeciesByCampaign(project.id).then(setSpecies);
    }
  }, [project.id, sensorId]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    commonName: string;
    scientificName: string;
  } | null>(null);
  const [detectionsModal, setDetectionsModal] = useState<Species | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [hiddenLegends, setHiddenLegends] = useState<Set<string>>(new Set());

  const speciesData = species.reduce(
    (acc, s) => {
      acc[s.iucnStatus] = (acc[s.iucnStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = STATUS_ORDER.filter(
    (s) => speciesData[s],
  ).map((name) => ({
    name,
    value: speciesData[name],
    color: IUCN_COLORS[name] || "#778192",
  }));

  const totalSpecies = chartData.reduce(
    (s, d) => s + d.value,
    0,
  );

  const AtRiskCount = (speciesData["EN"] ?? 0) + (speciesData["CR"] ?? 0) + (speciesData["VU"] ?? 0);

  const totalDetections = species.reduce(
    (sum, s) => sum + s.detectionCount,
    0,
  );

  const handleLegendHover = (index: number | null) =>
    setActiveIndex(index);

  const handleLegendClick = (name: string) => {
    setHiddenLegends((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="p-[20px] flex flex-col gap-[6px] h-full">
      {/* ── Stat Cards ── */}
      <div className="flex gap-[2px]">
        <StatCard
          label="Total Species"
          value={String(totalSpecies)}
          icon={<Leaf size={16} className="text-[#60A896]" />}
          accentColor="#60A896"
        />
        <StatCard
          label="At Risk"
          value={String(AtRiskCount)}
          icon={
            <AlertTriangle
              size={16}
              className="text-[#D03A1E]"
            />
          }
          accentColor="#D03A1E"
          valueColor="#D03A1E"
          tooltip="Species classified as Endangered (EN) or Critically Endangered (CR) on the IUCN Red List. Vulnerable (VU) and Near Threatened (NT) are excluded."
        />
        <StatCard
          label="Total Detections"
          value={totalDetections.toLocaleString()}
          icon={<Activity size={16} className="text-[#778192]" />}
          accentColor="#778192"
        />
        {sensorInfo ? (
          <StatCard
            label="Location"
            value={sensorInfo.coordinates}
            icon={
              <MapPin size={16} className="text-[#778192]" />
            }
            accentColor="#778192"
            subtext={`${sensorInfo.elevation} · ${sensorInfo.habitat}`}
          />
        ) : (
          <StatCard
            label="Sensors"
            value={String(project.sensors.length)}
            icon={
              <RadioTower
                size={16}
                className="text-[#778192]"
              />
            }
            accentColor="#778192"
          />
        )}
      </div>

      {/* ── Chart + Species List ── */}
      <div className="grid grid-cols-12 grid-rows-1 gap-[6px] flex-1 min-h-0">
        <IucnDonutChart
          chartData={chartData}
          activeIndex={activeIndex}
          hiddenLegends={hiddenLegends}
          onLegendHover={handleLegendHover}
          onLegendClick={handleLegendClick}
        />
        <SpeciesList
          species={species}
          totalSpecies={totalSpecies}
          playingAudio={playingAudio}
          onSetPlayingAudio={setPlayingAudio}
          onImageClick={(url, commonName, scientificName) =>
            setLightboxImage({ url, commonName, scientificName })
          }
          onOpenDetections={setDetectionsModal}
        />
      </div>

      {/* Detections Modal */}
      {detectionsModal && (
        <AllDetectionsModal
          species={detectionsModal}
          iucnColor={IUCN_COLORS[detectionsModal.iucnStatus] ?? "#778192"}
          onClose={() => setDetectionsModal(null)}
        />
      )}

      {/* Lightbox */}
      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
