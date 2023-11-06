import { ComponentProps, PropsWithChildren, useMemo, useRef } from "react";
import { CircularProgress, Stack, Typography, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PaperStack } from "../paper-stack/PaperStack";
import { useElementDimensions } from "@src/hooks/useElementDimensions";

type ValidChartDataItem = {
  [key: string]: unknown;
};

type CartesianGridProps = {
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
  stroke?: string;
};

type VisualizationType = "bar" | "line" | "area";

type LegendIconType =
  | "line"
  | "square"
  | "rect"
  | "circle"
  | "cross"
  | "diamond"
  | "star"
  | "triangle"
  | "wye";

const defaultCartesianGridProps: CartesianGridProps = {
  horizontal: false,
  vertical: false,
  strokeDasharray: "0 0",
  stroke: "rgba(255, 255, 255, 0.1)",
};

type ChartProps<T extends ValidChartDataItem> = {
  /**
   * The data to be displayed in the chart.
   */
  data: T[];
  /**
   * Function to be called when a bar is clicked.
   */
  onBarClick?: (data: T) => void;
  /**
   * The key of the data to be displayed on the X axis.
   * If orientation is "vertical", this will be the Y axis.
   */
  xAxisKey: keyof T;
  /**
   * If true, the X axis will be hidden.
   */
  hideXAxis?: boolean;
  /**
   * Anchor position of the X axis. Defaults to "bottom".
   */
  xAxisAnchor?: "top" | "bottom";
  /**
   * X axis interval. Defaults to undefined.
   */
  xAxisInterval?: ComponentProps<typeof XAxis>["interval"];
  /**
   * The width of the X axis in percent. Defaults to 100.
   */
  xAxisWidthPercent?: number;
  /**
   * Function to format the X axis values.
   */
  xAxisFormatter?: (value: string) => string;
  /**
   * The key of the data to be displayed on the Y axis.
   * If orientation is "vertical", this will be the X axis.
   */
  yAxisKey: keyof T;
  /**
   * If true, the Y axis will be hidden.
   */
  hideYAxis?: boolean;
  /**
   * Anchor position of the Y axis. Defaults to "left".
   */
  yAxisAnchor?: "left" | "right";
  /**
   * Position of the Y axis label. Defaults to "outside".
   */
  yAxisLabelPosition?: "outside" | "inside";
  /**
   * Y axis interval. Defaults to undefined.
   */
  yAxisInterval?: ComponentProps<typeof YAxis>["interval"];
  /**
   * Y axis unit. Defaults to undefined.
   */
  yAxisUnit?: string;
  /**
   * Function to format the Y axis values.
   */
  yAxisFormatter?: (value: string) => string;
  /**
   * The height of the chart. Defaults to 300.
   */
  height?: number;
  /**
   * If true, the legend will be shown. Defaults to false.
   */
  showLegend?: boolean;
  /**
   * The key of the data to be displayed in the legend.
   */
  legendKey?: keyof T;
  /**
   * The type of icon to be displayed in the legend.
   */
  legendIconType?: LegendIconType;
  /**
   * The size of the icon to be displayed in the legend.
   */
  legendIconSize?: number;
  /**
   * Function to render the tooltip. Defaults to undefined, which will render the default tooltip.
   */
  tooltipRenderFn?: (data?: T) => React.ReactNode;
  /**
   * If true, the tooltip will be shown. Defaults to true.
   */
  showTooltip?: boolean;
  /**
   * Props to be passed to the CartesianGrid component.
   */
  cartesianGrid?: CartesianGridProps;
  /**
   * The orientation of the chart. Defaults to "horizontal".
   * If "vertical", the X axis will be the Y axis and vice versa.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * An array of colors to be used in the chart.
   * If not provided, the primary color will be used.
   */
  colors?: string[];
  /**
   * Text to be displayed when there is no data.
   */
  emptyDataText?: string;
  /**
   * If true, a loading spinner will be displayed.
   */
  loading?: boolean;
  /**
   * The maximum value of the Y axis.
   * If not provided, the maximum value will be calculated from the data.
   */
  dataMax?: number;
  /**
   * The type of visualization. Defaults to "bar".
   */
  type?: VisualizationType;
  /**
   * If true, dots will be displayed on the line for both line and area charts.
   */
  lineDot?: boolean;
  /**
   * The width of the bar stroke. Defaults to 1.
   */
  barStrokeWidth?: number;
};

export function CustomChart<T extends ValidChartDataItem>({
  data,
  onBarClick,
  xAxisKey,
  hideXAxis,
  xAxisAnchor = "bottom",
  xAxisInterval,
  xAxisWidthPercent = 100,
  xAxisFormatter,
  yAxisKey,
  hideYAxis,
  yAxisAnchor = "left",
  yAxisLabelPosition = "outside",
  yAxisInterval,
  yAxisUnit,
  yAxisFormatter,
  height = 300,
  showLegend,
  legendKey,
  legendIconType,
  legendIconSize = 12,
  tooltipRenderFn,
  showTooltip = true,
  cartesianGrid,
  orientation = "horizontal",
  colors,
  emptyDataText,
  loading,
  dataMax,
  type = "bar",
  lineDot = false,
  barStrokeWidth = 1,
}: ChartProps<T>) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const containerDimensions = useElementDimensions({ ref });

  const xAxisHorizontalPadding = useMemo(
    () =>
      calcXAxisHorizonalPadding(xAxisWidthPercent, containerDimensions.width),
    [xAxisWidthPercent, containerDimensions.width]
  );

  const yAxisWidth = useMemo(() => {
    const max = Math.max(...data.map((item) => item[yAxisKey] as number));

    return calcYAxisWidth(max);
  }, [data, yAxisKey]);

  const cartesianGridProps = useMemo(
    () => ({ ...defaultCartesianGridProps, ...cartesianGrid }),
    [cartesianGrid]
  );

  const colorsArray = useMemo(() => {
    if (colors) {
      return colors;
    }

    return [theme.palette.primary.main];
  }, [colors, theme.palette.primary.main]);

  const xAxisDomain = useMemo(() => {
    if (!dataMax) {
      return undefined;
    }

    const base = 0;
    const min = Math.min(...data.map((item) => item[yAxisKey] as number));
    const max = dataMax;

    if (min < base) {
      return [min, max];
    }

    return [base, max];
  }, [data, dataMax, yAxisKey]);

  const xAxisTicks = useMemo(() => {
    if (!dataMax) {
      return undefined;
    }

    const base = 0;
    const min = Math.min(...data.map((item) => item[yAxisKey] as number));
    const max = dataMax;

    return [min, base, max].sort((a, b) => a - b);
  }, [data, dataMax, yAxisKey]);

  return (
    <Stack ref={ref} width="100%" height={height}>
      <ResponsiveContainer width="100%" height={height}>
        {loading ? (
          <Stack justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Stack>
        ) : (
          <ComposedChart data={data} layout={orientation}>
            <CartesianGrid
              strokeDasharray={cartesianGridProps.strokeDasharray}
              stroke={cartesianGridProps.stroke}
              vertical={cartesianGridProps.vertical}
              horizontal={cartesianGridProps.horizontal}
            />

            {!!data.length && showTooltip && (
              <Tooltip
                content={({ active, payload, label }) =>
                  tooltipRenderFn?.(payload?.[0]?.payload as T | undefined) ?? (
                    <DefaultTooltip
                      active={active}
                      payload={payload as DefaultTooltipProps["payload"]}
                      label={label}
                      unit={yAxisUnit}
                    />
                  )
                }
              />
            )}

            {!!showLegend && (
              <Legend
                iconType={legendIconType}
                iconSize={legendIconSize}
                payload={
                  legendKey
                    ? data.map((item, idx) => ({
                        value: item[legendKey],
                        type: legendIconType,
                        color: colorsArray[idx % colorsArray.length],
                      }))
                    : undefined
                }
              />
            )}

            {type === "bar" && (
              <Bar dataKey={yAxisKey as string} unit={yAxisUnit}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    stroke={colorsArray[index % colorsArray.length]}
                    strokeWidth={barStrokeWidth}
                    fill={colorsArray[index % colorsArray.length]}
                    fillOpacity={0.6}
                    onClick={() => onBarClick?.(data[index])}
                    cursor={onBarClick ? "pointer" : "default"}
                  />
                ))}
              </Bar>
            )}

            {type === "line" && (
              <Line
                dataKey={yAxisKey as string}
                unit={yAxisUnit}
                stroke={colorsArray[0]}
                strokeWidth={1}
                dot={lineDot}
              />
            )}

            {type === "area" && (
              <Area
                dataKey={yAxisKey as string}
                unit={yAxisUnit}
                stroke={colorsArray[0]}
                strokeWidth={1}
                fill={colorsArray[0]}
                dot={lineDot}
              />
            )}

            <XAxis
              type={orientation === "horizontal" ? "category" : "number"}
              dataKey={String(
                orientation === "horizontal" ? xAxisKey : yAxisKey
              )}
              orientation={xAxisAnchor}
              tickFormatter={xAxisFormatter}
              hide={hideXAxis}
              style={{
                fill: theme.palette.text.secondary,
                fontSize: theme.typography.caption.fontSize,
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.85)",
              }}
              domain={xAxisDomain}
              ticks={xAxisTicks}
              interval={xAxisInterval}
              padding={{
                left: xAxisHorizontalPadding,
                right: xAxisHorizontalPadding,
              }}
            />

            <YAxis
              type={orientation === "horizontal" ? "number" : "category"}
              dataKey={String(
                orientation === "horizontal" ? yAxisKey : xAxisKey
              )}
              orientation={yAxisAnchor}
              mirror={yAxisLabelPosition === "inside"}
              width={yAxisWidth}
              tickFormatter={yAxisFormatter}
              hide={hideYAxis}
              style={{
                fill: theme.palette.text.secondary,
                fontSize: theme.typography.caption.fontSize,
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.85)",
              }}
              interval={yAxisInterval}
            />

            {!data.length && emptyDataText && (
              <text
                x="50%"
                y="44.5%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill={theme.palette.text.secondary}
              >
                {emptyDataText}
              </text>
            )}
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </Stack>
  );
}

export function CustomTooltipContainer({ children }: PropsWithChildren) {
  const theme = useTheme();

  if (!children) {
    return null;
  }

  return (
    <PaperStack
      spacing={0.5}
      elevation={8}
      sx={{
        py: 1,
        px: 3,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.action.disabledBackground,
      }}
    >
      {children}
    </PaperStack>
  );
}

type DefaultTooltipProps<T extends ValidChartDataItem = ValidChartDataItem> = {
  active?: boolean;
  payload?: {
    name: string;
    value: string | number | Date;
    formatter?: (value: string | number | Date) => string;
    payload: T;
  }[];
  label?: string;
  unit?: string;
};

function DefaultTooltip({ active, payload, label, unit }: DefaultTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { name, value, formatter } = payload[0];

  return (
    <CustomTooltipContainer>
      <Typography variant="body2" fontWeight="bold" textTransform="capitalize">
        {label}
      </Typography>

      <Typography variant="body2">
        {name}:{" "}
        <b>
          {String(formatter ? formatter(value) : value)} {unit}
        </b>
      </Typography>
    </CustomTooltipContainer>
  );
}

function calcXAxisHorizonalPadding(
  xAxisWidthPercent: number,
  containerWidth: number
) {
  const widthInPx = (containerWidth * xAxisWidthPercent) / 100;
  const padding = (containerWidth - widthInPx) / 2;

  return padding;
}

function calcYAxisWidth(maxValue: number, charWidth: number = 8) {
  const maxValueLength = String(maxValue).length;

  return maxValueLength * charWidth;
}
