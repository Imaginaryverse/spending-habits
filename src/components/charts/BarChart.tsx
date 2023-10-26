import theme from "@src/theme/theme";
import { useMemo } from "react";
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

type ValidBarChartDataItem = {
  [key: string]: string | number;
};

type CartesianGridProps = {
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
  stroke?: string;
};

const defaultCartesianGridProps: CartesianGridProps = {
  horizontal: false,
  vertical: false,
  strokeDasharray: "0 0",
  stroke: "rgba(255, 255, 255, 0.1)",
};

type BarChartProps<T extends ValidBarChartDataItem> = {
  data: T[];
  xAxisKey: keyof T;
  xAxisAnchor?: "top" | "bottom";
  xAxisFormatter?: (value: string) => string;
  yAxisKey: keyof T;
  yAxisAnchor?: "left" | "right";
  yAxisLabelPosition?: "outside" | "inside";
  yAxisFormatter?: (value: string) => string;
  height?: number;
  showLegend?: boolean;
  cartesianGrid?: CartesianGridProps;
  orientation?: "horizontal" | "vertical";
  colors?: string[];
};

export function BarChart<T extends ValidBarChartDataItem>({
  data,
  xAxisKey,
  xAxisAnchor = "bottom",
  xAxisFormatter,
  yAxisKey,
  yAxisAnchor = "left",
  yAxisLabelPosition = "outside",
  yAxisFormatter,
  height = 300,
  showLegend = true,
  cartesianGrid,
  orientation = "horizontal",
  colors,
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
      <RechartsBarChart data={data} layout={orientation}>
        <CartesianGrid
          strokeDasharray={cartesianGridProps.strokeDasharray}
          stroke={cartesianGridProps.stroke}
          vertical={cartesianGridProps.vertical}
          horizontal={cartesianGridProps.horizontal}
        />

        <XAxis
          type={orientation === "horizontal" ? "category" : "number"}
          dataKey={String(orientation === "horizontal" ? xAxisKey : yAxisKey)}
          orientation={xAxisAnchor}
          tickFormatter={xAxisFormatter}
        />

        <YAxis
          type={orientation === "horizontal" ? "number" : "category"}
          dataKey={String(orientation === "horizontal" ? yAxisKey : xAxisKey)}
          orientation={yAxisAnchor}
          mirror={yAxisLabelPosition === "inside"}
          tickFormatter={yAxisFormatter}
        />

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

        {!!showLegend && <Legend />}

        <Bar dataKey={yAxisKey as string}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorsArray[index % colorsArray.length]}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
