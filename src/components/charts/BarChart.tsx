import theme from "@src/theme/theme";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
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
}: BarChartProps<T>) {
  const cartesianGridProps = useMemo(
    () => ({ ...defaultCartesianGridProps, ...cartesianGrid }),
    [cartesianGrid]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid
          strokeDasharray={cartesianGridProps.strokeDasharray}
          stroke={cartesianGridProps.stroke}
          vertical={cartesianGridProps.vertical}
          horizontal={cartesianGridProps.horizontal}
        />

        <XAxis
          dataKey={xAxisKey as string}
          orientation={xAxisAnchor}
          tickFormatter={xAxisFormatter}
        />

        <YAxis
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

        <Bar dataKey={yAxisKey as string} fill={theme.palette.primary.main} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
