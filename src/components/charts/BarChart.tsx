import theme from "@src/theme/theme";
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

type BarChartProps<T extends ValidBarChartDataItem> = {
  data: T[];
  xAxisKey: keyof T;
  yAxisKey: keyof T;
};

export function BarChart<T extends ValidBarChartDataItem>({
  data,
  xAxisKey,
  yAxisKey,
}: BarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={data}>
        <CartesianGrid
          strokeDasharray="8 4"
          stroke="rgba(255, 255, 255, 0.2)"
        />
        <XAxis dataKey={xAxisKey as string} />
        <YAxis />
        <Tooltip
          contentStyle={{
            color: theme.palette.primary.contrastText,
            backgroundColor: "rgb(255, 255, 255)",
            border: "2px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "0.25rem",
          }}
          itemStyle={{ color: theme.palette.primary.contrastText }}
          labelStyle={{ color: theme.palette.primary.contrastText }}
          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
        />
        <Legend />
        <Bar dataKey={yAxisKey as string} fill={theme.palette.primary.main} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
