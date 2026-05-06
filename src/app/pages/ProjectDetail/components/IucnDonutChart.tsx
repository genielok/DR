import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { F, IUCN_TEXT, IUCN_ABB } from "../const";

interface IucnDonutChartProps {
  chartData: { name: string; value: number; color: string }[];
  activeIndex: number | null;
  hiddenLegends: Set<string>;
  onLegendHover: (index: number | null) => void;
  onLegendClick: (name: string) => void;
  onScrollToStatus?: (status: string) => void;
}

export function IucnDonutChart({
  chartData,
  activeIndex,
  hiddenLegends,
  onLegendHover,
  onLegendClick,
  onScrollToStatus,
}: IucnDonutChartProps) {
  const visibleChartData = chartData.filter(
    (item) => !hiddenLegends.has(item.name),
  );
  const visibleTotalSpecies = visibleChartData.reduce(
    (s, d) => s + d.value,
    0,
  );

  const chartOption: EChartsOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#2b2f3f",
        borderColor: "#474f5f",
        borderWidth: 1,
        textStyle: {
          color: "rgba(255,255,255,0.9)",
          fontSize: 11,
          fontFamily: F.regular,
        },
        formatter: (params: any) => {
          const percent = (
            (params.value / visibleTotalSpecies) *
            100
          ).toFixed(1);
          return `<div style="padding:4px;font-family:${F.regular}">
            <div style="font-family:${F.bold};margin-bottom:4px">${params.name}</div>
            <div style="color:#b7b9be">${params.value} species (${percent}%)</div>
          </div>`;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["45%", "75%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: "#161921",
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
          data: visibleChartData.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color,
              opacity:
                activeIndex === null ||
                  activeIndex ===
                  chartData.findIndex(
                    (d) => d.name === item.name,
                  )
                  ? 1
                  : 0.35,
            },
          })),
        },
      ],
    }),
    [
      visibleChartData,
      visibleTotalSpecies,
      activeIndex,
      chartData,
    ],
  );

  const onChartEvents = {
    mouseover: (params: any) => {
      if (params.dataIndex !== undefined)
        onLegendHover(params.dataIndex);
    },
    mouseout: () => onLegendHover(null),
    click: (params: any) => {
      if (params.name) onScrollToStatus?.(params.name);
    },
  };

  return (
    <div className="col-span-4">
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] h-full flex flex-col">
        <div className="h-[40px] px-[20px] flex items-center">
          <span
            className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Species by IUCN Status
          </span>
        </div>

        <div className="flex flex-col items-center gap-[16px] flex-1 justify-center px-[20px] pb-[20px]">
          <div
            className="relative flex-shrink-0"
            style={{ width: 260, height: 260 }}
          >
            <ReactECharts
              option={chartOption}
              style={{ height: "260px", width: "260px" }}
              onEvents={onChartEvents}
              opts={{ renderer: "canvas" }}
            />
          </div>

          {/* Legend */}
          <div className="w-full flex flex-col gap-y-[2px]">
            {chartData.map((item, i) => {
              const isHovered = activeIndex === i;
              const isHidden = hiddenLegends.has(item.name);
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-[8px] cursor-pointer px-[8px] py-[6px] transition-all duration-150"
                  style={{
                    background: isHovered
                      ? `${item.color}18`
                      : "transparent",
                    opacity: isHidden ? 0.4 : 1,
                  }}
                  onMouseEnter={() => onLegendHover(i)}
                  onMouseLeave={() =>
                    onLegendHover(null)
                  }
                  onClick={() =>
                    onLegendClick(item.name)
                  }
                >
                  <span
                    className="text-[12px] px-[5px] py-[1px] flex-shrink-0"
                    style={{
                      fontFamily: F.bold,
                      background: item.color,
                      color: IUCN_TEXT[item.name],
                      textDecoration: isHidden
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="text-[13px] text-[#778192] flex-1 truncate"
                    style={{
                      fontFamily: F.regular,
                      textDecoration: isHidden
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {IUCN_ABB[item.name]}
                  </span>
                  <span
                    className="text-[12px] text-[rgba(255,255,255,0.9)]"
                    style={{
                      fontFamily: F.bold,
                      textDecoration: isHidden
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
