import { EcosystemExtent } from "./EcosystemExtent";
import { SpeciesExtinctionRiskContent } from "./SpeciesExtinctionRisk";
import type { LayerType } from "./MapViewer";
import { useState, useEffect } from "react";
import clsx from "clsx";

type PanelInfoProps = {
  selectedPanel: string | null;
  isFullWidth?: boolean;
  onLayerChange?: (layer: LayerType) => void;
  onPublicationSelect?: (publicationId: string | null) => void;
  onConditionLayersChange?: (layers: ConditionLayer[]) => void;
  onProjectHover?: (id: string | null) => void;
  onProjectClick?: (id: string, hasSensors: boolean) => void;
  hoveredProjectId?: string | null;
};

export type ConditionLayer = {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  opacity: number;
};

export function PanelInfo({
  selectedPanel,
  isFullWidth,
  onLayerChange,
  onPublicationSelect,
  onConditionLayersChange,
  hoveredProjectId,
  onProjectHover,
  onProjectClick,
}: PanelInfoProps) {
  const renderPanel = () => {
    switch (selectedPanel) {
      case "ecosystem-extent":
        return (
          <EcosystemExtent
            onLayerChange={onLayerChange}
            onPublicationSelect={onPublicationSelect}
          />
        );
      case "ecosystem-condition":
        return (
          <EcosystemConditionInfo
            onLayersChange={onConditionLayersChange}
          />
        );
      case "species-extinction-risk":
        return (
          <SpeciesExtinctionRiskContent
            hoveredProjectId={hoveredProjectId}
            onCardHover={onProjectHover}
            onCardClick={onProjectClick}
          />
        );
      case "species-populations":
        return (
          <div className="text-[#f5f7fa] p-6">
            Species Populations panel coming soon...
          </div>
        );
      case "water-impact":
        return (
          <div className="text-[#f5f7fa] p-6">
            Water Impact panel coming soon...
          </div>
        );
      case "human-impact":
        return (
          <div className="text-[#f5f7fa] p-6">
            Human Impact panel coming soon...
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-[#f5f7fa] text-lg mb-4">
              Info Panel
            </h2>
            <div className="flex flex-col gap-4">
              <InfoSection
                title="Overview"
                content="Select a menu item to view detailed information."
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-[#161921] flex flex-col h-full overflow-auto shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 px-[5px] ${
        isFullWidth
          ? "flex-1" // 占满剩余空间
          : "w-[420px] max-lg:w-[320px] max-md:w-[280px]" // 固定宽度
      }`}
    >
      {renderPanel()}
    </div>
  );
}

function InfoSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-[#1e2230] border border-[#474F5F] p-4 rounded-lg">
      <h3 className="text-[#f5f7fa] text-sm font-medium mb-2">
        {title}
      </h3>
      <p className="text-[#b4bac4] text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function EcosystemConditionInfo({
  onLayersChange,
}: {
  onLayersChange?: (layers: ConditionLayer[]) => void;
}) {
  const conditionClasses = [
    {
      label: "Intact",
      color: "#7ED321",
      area: "1,240 ha",
      pct: "31%",
    },
    {
      label: "Good",
      color: "#4A90E2",
      area: "980 ha",
      pct: "24%",
    },
    {
      label: "Degraded",
      color: "#F5A623",
      area: "860 ha",
      pct: "21%",
    },
    {
      label: "Heavily modified",
      color: "#D0021B",
      area: "620 ha",
      pct: "15%",
    },
    {
      label: "Severely degraded",
      color: "#9013FE",
      area: "370 ha",
      pct: "9%",
    },
  ];

  const [layers, setLayers] = useState<ConditionLayer[]>([
    {
      id: "ortho",
      name: "Ortho",
      color: "#8B4513",
      visible: true,
      opacity: 1,
    },
    {
      id: "canopy-height-model",
      name: "Canopy Height Model",
      color: "#4A90E2",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "forest-segmented",
      name: "Forest Segmented",
      color: "#50E3C2",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "digital-terrain-model",
      name: "Digital Terrain Model",
      color: "#F5A623",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "non-forest",
      name: "Non Forest",
      color: "#D0021B",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "forest-natural",
      name: "Forest Natural",
      color: "#7ED321",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "forest-natural-buffer",
      name: "Forest Natural Buffer",
      color: "#9013FE",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "forest-invasive-high-confidence",
      name: "Forest Invasive High Confidence",
      color: "#FF6B6B",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "forest-natural-low-confidence",
      name: "Forest Natural Low Confidence",
      color: "#4ECDC4",
      visible: false,
      opacity: 0.3,
    },
    {
      id: "grid",
      name: "Grid",
      color: "#FFFFFF",
      visible: true,
      opacity: 0.3,
    },
  ]);

  const handleLayerChange = (id: string, visible: boolean) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, visible } : layer,
    );
    setLayers(updatedLayers);
    if (onLayersChange) {
      onLayersChange(updatedLayers);
    }
  };

  const handleOpacityChange = (id: string, opacity: number) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, opacity } : layer,
    );
    setLayers(updatedLayers);
    if (onLayersChange) {
      onLayersChange(updatedLayers);
    }
  };

  // Initialize layers on mount
  useEffect(() => {
    if (onLayersChange) {
      onLayersChange(layers);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-[#2b2f3f]">
        <p className="font-['Hexagon_Akkurat',sans-serif] text-[11px] uppercase tracking-widest text-[#8698af] mb-1">
          Assessment
        </p>
        <h2 className="font-['Inter',sans-serif] text-[20px] text-[#f5f7fa] leading-tight">
          Ecosystem Condition
        </h2>
        <p className="font-['Hexagon_Akkurat',sans-serif] text-[12px] text-[#8698af] mt-2 leading-relaxed">
          Area and change by condition class (ha, %)
        </p>
      </div>

      {/* Condition Class Summary */}
      <div className="px-5 pt-5 pb-4">
        <p className="font-['Hexagon_Akkurat',sans-serif] text-[11px] uppercase tracking-widest text-[#8698af] mb-3">
          Condition Classes
        </p>
        <div className="flex flex-col gap-2">
          {conditionClasses.map((cls) => (
            <div
              key={cls.label}
              className="flex items-center gap-3"
            >
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: cls.color }}
              />
              <span className="font-['Hexagon_Akkurat',sans-serif] text-[13px] text-[#f5f7fa] flex-1">
                {cls.label}
              </span>
              <span className="font-['Hexagon_Akkurat',sans-serif] text-[12px] text-[#8698af] w-[56px] text-right">
                {cls.area}
              </span>
              <span className="font-['Hexagon_Akkurat',sans-serif] text-[12px] text-[#778192] w-[36px] text-right">
                {cls.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[#2b2f3f]" />

      {/* Total Area */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="font-['Hexagon_Akkurat',sans-serif] text-[12px] text-[#8698af] uppercase tracking-widest">
            Total Assessed Area
          </span>
          <span className="font-['Inter',sans-serif] text-[16px] text-[#f5f7fa]">
            4,070 ha
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[#2b2f3f]" />

      {/* Layer Controls */}
      <div className="px-5 pt-4 pb-4">
        <p className="font-['Hexagon_Akkurat',sans-serif] text-[11px] uppercase tracking-widest text-[#8698af] mb-3">
          Layer Controls
        </p>
        <div className="flex flex-col gap-3">
          {/* Reverse the array to show top layer first in the UI */}
          {[...layers].reverse().map((layer) => (
            <div
              key={layer.id}
              className="flex flex-col gap-2 pb-3 border-b border-[#2b2f3f] last:border-b-0"
            >
              <div className="flex items-center gap-3">
                {/* Toggle Button with Color */}
                <button
                  onClick={() =>
                    handleLayerChange(layer.id, !layer.visible)
                  }
                  className={clsx(
                    "w-6 h-6 rounded border-2 transition-all duration-200 flex-shrink-0",
                    layer.visible
                      ? "border-white shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                      : "border-[#474F5F] opacity-50",
                  )}
                  style={{
                    backgroundColor: layer.visible
                      ? layer.color
                      : "transparent",
                  }}
                />

                {/* Layer Name */}
                <span
                  className={clsx(
                    "font-['Roboto:Medium',sans-serif] text-[13px] flex-1",
                    layer.visible
                      ? "text-white"
                      : "text-[#8698af]",
                  )}
                >
                  {layer.name}
                </span>

                {/* Opacity Value */}
                <span className="font-['Roboto:Regular',sans-serif] text-[12px] text-[#8698af] w-10 text-right">
                  {Math.round(layer.opacity * 100)}%
                </span>
              </div>

              {/* Opacity Slider */}
              <div className="flex items-center gap-2 pl-9">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.opacity}
                  onChange={(e) =>
                    handleOpacityChange(
                      layer.id,
                      parseFloat(e.target.value),
                    )
                  }
                  className="flex-1 h-1 bg-[#474F5F] rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(0,0,0,0.5)]
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                  style={{
                    background: `linear-gradient(to right, ${layer.color} 0%, ${layer.color} ${layer.opacity * 100}%, #474F5F ${layer.opacity * 100}%, #474F5F 100%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[#2b2f3f]" />

      {/* Placeholder note */}
      <div className="px-5 py-4 mt-auto">
        <div className="bg-[#1e2230] border border-[#474F5F] rounded p-3">
          <p className="font-['Hexagon_Akkurat',sans-serif] text-[11px] text-[#8698af] leading-relaxed">
            Use the layer controls above to toggle visibility
            and adjust opacity for each condition layer.
          </p>
        </div>
      </div>
    </div>
  );
}