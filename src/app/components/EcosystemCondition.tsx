import clsx from "clsx";
import imgForestNatural from "@/assets/forest-natural.png";
import imgCanopyHeightModel from "@/assets/canopy-height-model.png";
import imgDigitalTerrainModel from "@/assets/digital-terrain-model.png";
import imgForestNaturalLowConfidence from "@/assets/forest-natural-low-confidence.png";
import imgGrid from "@/assets/grid.png";
import imgOrtho from "@/assets/ortho.png";
import imgForestNaturalBuffer from "@/assets/forest-natural-buffer.png";
import imgNonForest from "@/assets/non-forest.png";
import imgForestSegmented from "@/assets/forest-segmented.png";
import imgForestInvasiveHighConfidence from "@/assets/forest-invasive-high-confidence.png";
import type { ConditionLayer } from "./PanelInfo";

const LAYER_IMAGES: Record<string, string> = {
  "ortho": imgOrtho,
  "canopy-height-model": imgCanopyHeightModel,
  "forest-segmented": imgForestSegmented,
  "digital-terrain-model": imgDigitalTerrainModel,
  "non-forest": imgNonForest,
  "forest-natural": imgForestNatural,
  "forest-natural-buffer": imgForestNaturalBuffer,
  "forest-invasive-high-confidence": imgForestInvasiveHighConfidence,
  "forest-natural-low-confidence": imgForestNaturalLowConfidence,
  "grid": imgGrid,
};

type EcosystemConditionProps = {
  className?: string;
  layers: ConditionLayer[];
};

export function EcosystemCondition({ className, layers }: EcosystemConditionProps) {
  // Map ConditionLayer to include images
  const layersWithImages = layers.map((layer) => ({
    ...layer,
    image: LAYER_IMAGES[layer.id] || imgOrtho,
  }));

  return (
    <div className={clsx("bg-[#161921] relative overflow-hidden", className)}>
      {/* Map Layers - stacked from bottom to top */}
      <div className="absolute inset-0">
        {layersWithImages.map((layer) => (
          <div
            key={layer.id}
            className="absolute inset-0"
            style={{
              opacity: layer.visible ? layer.opacity : 0,
              pointerEvents: "none",
            }}
          >
            <img
              src={layer.image}
              alt={layer.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}