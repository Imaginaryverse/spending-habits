import { useMemo } from "react";
import { CircularProgress, Stack } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import theme from "@src/theme/theme";

type ValidBarChartDataItem = {
  [key: string]: string | number;
};

type CartesianGridProps = {
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
  stroke?: string;
};

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

type BarChartProps<T extends ValidBarChartDataItem> = {
  data: T[];
  xAxisKey: keyof T;
  hideXAxis?: boolean;
  xAxisAnchor?: "top" | "bottom";
  xAxisFormatter?: (value: string) => string;
  yAxisKey: keyof T;
  hideYAxis?: boolean;
  yAxisAnchor?: "left" | "right";
  yAxisLabelPosition?: "outside" | "inside";
  yAxisFormatter?: (value: string) => string;
  height?: number;
  showLegend?: boolean;
  legendKey?: keyof T;
  legendIconType?: LegendIconType;
  legendIconSize?: number;
  cartesianGrid?: CartesianGridProps;
  orientation?: "horizontal" | "vertical";
  colors?: string[];
  emptyDataText?: string;
  loading?: boolean;
};

export function BarChart<T extends ValidBarChartDataItem>({
  data,
  xAxisKey,
  hideXAxis,
  xAxisAnchor = "bottom",
  xAxisFormatter,
  yAxisKey,
  hideYAxis,
  yAxisAnchor = "left",
  yAxisLabelPosition = "outside",
  yAxisFormatter,
  height = 300,
  showLegend = true,
  legendKey,
  legendIconSize = 12,
  legendIconType,
  cartesianGrid,
  orientation = "horizontal",
  colors,
  emptyDataText,
  loading,
}: BarChartProps<T>) {
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      {loading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : (
        <RechartsBarChart data={data} layout={orientation}>
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

          <Bar dataKey={yAxisKey as string}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorsArray[index % colorsArray.length]}
              />
            ))}
          </Bar>

          <XAxis
            type={orientation === "horizontal" ? "category" : "number"}
            dataKey={String(orientation === "horizontal" ? xAxisKey : yAxisKey)}
            orientation={xAxisAnchor}
            tickFormatter={xAxisFormatter}
            hide={hideXAxis}
            style={{
              fill: theme.palette.text.secondary,
              fontSize: theme.typography.body2.fontSize,
              textShadow: "1px 1px 1px rgba(0, 0, 0, 0.85)",
            }}
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
              fontSize: theme.typography.body2.fontSize,
              textShadow: "1px 1px 1px rgba(0, 0, 0, 0.85)",
            }}
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
        </RechartsBarChart>
      )}
    </ResponsiveContainer>
  );
}
