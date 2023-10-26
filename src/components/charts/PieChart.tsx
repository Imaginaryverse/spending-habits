import theme from "@src/theme/theme";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type ValidPieChartDataItem = {
  [key: string]: string | number;
};

type PieChartProps<T extends ValidPieChartDataItem> = {
  data: T[];
  valueKey: keyof T;
  labelKey?: keyof T;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
};

// const colors = [
//   "hsl(45, 85%, 50%)",
//   "hsl(90, 85%, 50%)",
//   "hsl(180, 85%, 50%)",
//   "hsl(210, 85%, 50%)",
//   "hsl(315, 85%, 50%)",
//   "hsl(360, 85%, 50%)",
// ];

const colors = [
  "hsl(200, 85%, 50%)",
  "hsl(200, 75%, 60%)",
  "hsl(200, 65%, 70%)",
  "hsl(200, 55%, 80%)",
  "hsl(200, 45%, 90%)",
  "hsl(200, 35%, 95%)",
];

export function PieChart<T extends ValidPieChartDataItem>({
  data,
  valueKey,
  labelKey,
  height = 300,
  showTooltip = true,
  showLegend = true,
}: PieChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={valueKey as string}
          nameKey={labelKey as string}
          fill={theme.palette.primary.main}
          label
          innerRadius={"50%"}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke={theme.palette.background.default}
              strokeWidth={2}
            />
          ))}
        </Pie>

        {showTooltip && (
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
        )}

        {showLegend && (
          <Legend
            iconSize={10}
            formatter={(value, entry, index) => {
              const dataItem = data[index as number];
              const label = dataItem[labelKey as string];
              return label;
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
