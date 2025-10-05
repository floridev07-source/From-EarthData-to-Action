import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};


type ChartLegendContentProps = React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
  payload?: any;
  verticalAlign?: React.ComponentProps<typeof RechartsPrimitive.Legend>["verticalAlign"];
};

type PayloadEntry = Record<string, unknown> | undefined;

type TooltipEntry = Record<string, any>;

type LegendEntry = Record<string, any>;

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-hidden",
          "[&_.recharts-sector]:outline-hidden",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const declarations = colorConfig
        .map(([key, itemConfig]) => {
          const themeColor =
            "theme" in itemConfig && itemConfig.theme
              ? itemConfig.theme[theme as keyof typeof THEMES]
              : itemConfig.color;

          return themeColor ? `  --color-${key}: ${themeColor};` : null;
        })
        .filter(Boolean)
        .join("\n");

      if (!declarations) {
        return null;
      }

      return `${prefix} [data-chart='${id}'] {\n${declarations}\n}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!css) {
    return null;
  }

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent(props: any) {
  const {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
    ...rest
  } = props;

  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const [item] = payload as TooltipEntry[];
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const fallbackLabel =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(fallbackLabel, payload)}
        </div>
      );
    }

    if (!fallbackLabel) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{fallbackLabel}</div>;
  }, [config, hideLabel, label, labelClassName, labelFormatter, labelKey, payload]);

  if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const tooltipEntries = payload as TooltipEntry[];
  const nestLabel = tooltipEntries.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
      {...rest}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {tooltipEntries.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor =
            color ??
            (typeof item.payload === "object" && item.payload !== null
              ? ((item.payload as { fill?: string; stroke?: string }).fill ??
                (item.payload as { fill?: string; stroke?: string }).stroke)
              : undefined) ??
            item.color ??
            "#8884d8";

          const indicatorClasses = cn(
            "shrink-0 rounded-[2px] border",
            indicator === "dot" && "h-2.5 w-2.5",
            indicator === "line" && "w-1 self-stretch",
            indicator === "dashed" && "w-0 border-[1.5px] border-dashed bg-transparent",
            nestLabel && indicator === "dashed" && "my-0.5"
          );

          const indicatorStyle: React.CSSProperties =
            indicator === "dashed"
              ? { borderColor: indicatorColor }
              : { backgroundColor: indicatorColor, borderColor: indicatorColor };

          return (
            <div
              key={`${String(item.dataKey ?? item.name ?? index)}-${index}`}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div className={indicatorClasses} style={indicatorStyle} />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : `${item.value}`}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  ...props
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || !Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const legendEntries = payload as LegendEntry[];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
      {...props}
    >
      {legendEntries.map((item, index) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={`${String(item.dataKey ?? item.value ?? index)}-${index}`}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: PayloadEntry,
  key: string
) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const nestedPayload =
    "payload" in payload &&
    typeof (payload as { payload?: Record<string, unknown> | null }).payload ===
      "object"
      ? ((payload as { payload?: Record<string, unknown> | null }).payload as
          | Record<string, unknown>
          | undefined)
      : undefined;

  let configLabelKey: string = key;

  const directValue = (payload as Record<string, unknown>)[key];
  if (typeof directValue === "string") {
    configLabelKey = directValue;
  } else if (nestedPayload) {
    const nestedValue = nestedPayload[key];
    if (typeof nestedValue === "string") {
      configLabelKey = nestedValue;
    }
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
