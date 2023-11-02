import { ComponentProps, useMemo } from "react";
import { CircularProgress, Stack } from "@mui/material";
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
import theme from "@src/theme/theme";

type ValidChartDataItem = {
  [key: string]: string | number | Date;
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
};

export function CustomChart<T extends ValidChartDataItem>({
  data,
  xAxisKey,
  hideXAxis,
  xAxisAnchor = "bottom",
  xAxisInterval,
  xAxisFormatter,
  yAxisKey,
  hideYAxis,
  yAxisAnchor = "left",
  yAxisLabelPosition = "outside",
  yAxisInterval,
  yAxisFormatter,
  height = 300,
  showLegend,
  legendKey,
  legendIconSize = 12,
  legendIconType,
  cartesianGrid,
  orientation = "horizontal",
  colors,
  emptyDataText,
  loading,
  dataMax,
  type = "bar",
  lineDot = false,
}: ChartProps<T>) {
  const cartesianGridProps = useMemo(
    () => ({ ...defaultCartesianGridProps, ...cartesianGrid }),
    [cartesianGrid]
  );

  const colorsArray = useMemo(() => {
    if (colors) {
      return colors;
    }

    return [theme.palette.primary.main];
  }, [colors]);

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

          {!!data.length && (
            <Tooltip
              contentStyle={{
                color: theme.palette.primary.contrastText,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "0.25rem",
              }}
              itemStyle={{ color: theme.palette.primary.contrastText }}
              labelStyle={{ color: theme.palette.primary.contrastText }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
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
            <Bar dataKey={yAxisKey as string}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorsArray[index % colorsArray.length]}
                />
              ))}
            </Bar>
          )}

          {type === "line" && (
            <Line
              dataKey={yAxisKey as string}
              stroke={colorsArray[0]}
              strokeWidth={2}
              dot={lineDot}
            />
          )}

          {type === "area" && (
            <Area
              dataKey={yAxisKey as string}
              stroke={colorsArray[0]}
              strokeWidth={2}
              fill={colorsArray[0]}
              dot={lineDot}
            />
          )}

          <XAxis
            type={orientation === "horizontal" ? "category" : "number"}
            dataKey={String(orientation === "horizontal" ? xAxisKey : yAxisKey)}
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
          />

          <YAxis
            type={orientation === "horizontal" ? "number" : "category"}
            dataKey={String(orientation === "horizontal" ? yAxisKey : xAxisKey)}
            orientation={yAxisAnchor}
            mirror={yAxisLabelPosition === "inside"}
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
  );
}
