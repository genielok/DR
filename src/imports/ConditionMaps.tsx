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

export default function ConditionMaps() {
  return (
    <div className="relative size-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForestNatural} />
    </div>
  );
}