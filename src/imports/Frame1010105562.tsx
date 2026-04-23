import imgExtentLossGain1 from "@/assets/extent-loss-gain.png";
import imgForestGain1 from "@/assets/forest-gain.png";
import imgForest from "@/assets/forest.png";
import imgPlainOrtho1 from "@/assets/plain-ortho.png";
import imgSandGain from "@/assets/sand-gain.png";
import imgSand from "@/assets/sand.png";
import imgShrubGain from "@/assets/shrub-gain.png";
import imgShrub from "@/assets/shrub.png";
import imgWater from "@/assets/water.png";
import svgPaths from "./svg-59p9gekaw4";
type ComponentProps = {
  className?: string;
  property1?: "extent_loss&Gain" | "forest" | "forest_gain" | "plainOrtho" | "sand" | "sand_gain" | "shrub" | "shrub_gain" | "water";
};

function Component({ className, property1 = "extent_loss&Gain" }: ComponentProps) {
  return (
    <div className={className || "h-[2152px] relative w-[3074px]"}>
      {property1 === "extent_loss&Gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="extent_loss&Gain 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgExtentLossGain1} />
        </div>
      )}
      {property1 === "forest_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="forest_gain 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForestGain1} />
        </div>
      )}
      {property1 === "forest" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="forest">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForest} />
        </div>
      )}
      {property1 === "plainOrtho" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="plainOrtho 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPlainOrtho1} />
        </div>
      )}
      {property1 === "sand_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="sand_gain">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSandGain} />
        </div>
      )}
      {property1 === "sand" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="sand">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSand} />
        </div>
      )}
      {property1 === "shrub_gain" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="shrub_gain">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShrubGain} />
        </div>
      )}
      {property1 === "shrub" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="shrub">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShrub} />
        </div>
      )}
      {property1 === "water" && (
        <div className="absolute aspect-[3074/2152] left-0 right-0 top-0" data-name="water">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWater} />
        </div>
      )}
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#161921] relative size-full">
      <Component className="absolute h-[719px] left-[84px] top-[70px] w-[1027px]" property1="plainOrtho" />
      <div className="absolute h-[719px] left-[84px] overflow-clip top-[70px] w-[568px]">
        <Component className="absolute h-[719px] left-0 opacity-30 top-0 w-[1027px]" />
      </div>
      <div className="absolute h-[781px] left-[652px] top-[17px] w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 781">
            <path d="M0.5 0V781" id="Vector 750" stroke="var(--stroke-0, #70D6EF)" />
          </svg>
        </div>
      </div>
      <div className="absolute contents left-[1147px] top-[71px]" data-name="Paragraph">
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[71px] whitespace-nowrap">2020</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[359px] whitespace-nowrap">2029</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[391px] whitespace-nowrap">2030</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[103px] whitespace-nowrap">2021</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[135px] whitespace-nowrap">2022</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[167px] whitespace-nowrap">2023</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[199px] whitespace-nowrap">2024</p>
        <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[8px] left-[1147px] opacity-90 text-[18px] text-white top-[231px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          2025
        </p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[263px] whitespace-nowrap">2026</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[295px] whitespace-nowrap">2027</p>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[1147px] not-italic opacity-70 text-[8px] text-white top-[327px] whitespace-nowrap">2028</p>
        <div className="absolute h-[146.5px] left-[1182.5px] top-[74px] w-0">
          <div className="absolute inset-[-1.82%_-2.89px_0_-2.89px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7735 149.167">
              <path d={svgPaths.p2908a280} fill="var(--stroke-0, #70D6EF)" id="Vector 751" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[79px] top-[70.5px]">
        <div className="absolute contents left-[79px] top-[117px]">
          <p className="absolute font-['Roboto:Regular',sans-serif] leading-[14px] left-[100px] not-italic text-[14px] text-white top-[117px] whitespace-nowrap">Non-natural</p>
          <div className="absolute bg-[#e92f2e] left-[79px] size-[9px] top-[120.5px]" data-name="Container" />
        </div>
        <div className="absolute contents left-[79px] top-[70.5px]">
          <div className="absolute bg-[#6fbf81] left-[79px] size-[9px] top-[73px]" data-name="Container" />
          <p className="absolute font-['Roboto:Regular',sans-serif] leading-[14px] left-[100px] not-italic text-[14px] text-white top-[70.5px] whitespace-nowrap">Natural</p>
        </div>
        <div className="absolute contents left-[79px] top-[94px]">
          <div className="absolute bg-[#1bd71d] left-[79px] size-[9px] top-[96.5px]" data-name="Container" />
          <p className="absolute font-['Roboto:Regular',sans-serif] leading-[14px] left-[100px] not-italic text-[14px] text-white top-[94px] whitespace-nowrap">Natural gain (461ha)</p>
        </div>
      </div>
      <div className="absolute contents left-[36px] top-[71px]">
        <div className="absolute bg-gradient-to-b border border-[#778192] border-solid from-[20.792%] from-[rgba(119,129,146,0)] h-[101px] left-[36px] rounded-[50px] to-[#778192] to-[88.119%] top-[71px] w-[28px]" />
        <div className="absolute left-[38px] size-[24px] top-[97px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3801" r="11.5" stroke="var(--stroke-0, #778192)" />
          </svg>
        </div>
        <p className="absolute font-['Roboto:Regular',sans-serif] leading-[8px] left-[43px] not-italic text-[#474f5f] text-[8px] top-[105px] whitespace-nowrap">30%</p>
      </div>
    </div>
  );
}