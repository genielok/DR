import imgExtentLossGain1 from "@/assets/extent-loss-gain.png";
import imgForestGain1 from "@/assets/forest-gain.png";
import imgForest from "@/assets/forest.png";
import imgPlainOrtho1 from "@/assets/plain-ortho.png";
import imgSandGain from "@/assets/sand-gain.png";
import imgSand from "@/assets/sand.png";
import imgShrubGain from "@/assets/shrub-gain.png";
import imgShrub from "@/assets/shrub.png";
import imgWater from "@/assets/water.png";

export default function Component() {
  return (
    <div className="relative size-full">
      {"extent_loss&Gain" === "extent_loss&Gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="extent_loss&Gain 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgExtentLossGain1} />
        </div>
      )}
      {"extent_loss&Gain" === "forest_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="forest_gain 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForestGain1} />
        </div>
      )}
      {"extent_loss&Gain" === "forest" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="forest">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForest} />
        </div>
      )}
      {"extent_loss&Gain" === "plainOrtho" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="plainOrtho 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPlainOrtho1} />
        </div>
      )}
      {"extent_loss&Gain" === "sand_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="sand_gain">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSandGain} />
        </div>
      )}
      {"extent_loss&Gain" === "sand" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="sand">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSand} />
        </div>
      )}
      {"extent_loss&Gain" === "shrub_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="shrub_gain">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShrubGain} />
        </div>
      )}
      {"extent_loss&Gain" === "shrub" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="shrub">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShrub} />
        </div>
      )}
      {"extent_loss&Gain" === "water" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="water">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWater} />
        </div>
      )}
    </div>
  );
}