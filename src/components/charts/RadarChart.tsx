import { CircularProgress, Stack, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

type ValidRadarChartItem = {
  name: string;
  value: number;
};

type RadarChartProps<T extends ValidRadarChartItem> = {
  data: T[];
  height?: number;
  color?: string;
  emptyDataText?: string;
  loading?: boolean;
  gridType?: "polygon" | "circle";
  showDots?: boolean;
  showTooltip?: boolean;
};

export function RadarChart<T extends ValidRadarChartItem>({
  data,
  height = 300,
  color,
  loading,
  gridType = "polygon",
  showDots = true,
  showTooltip = true,
}: RadarChartProps<T>) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      {loading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : (
        <RechartsRadarChart data={data} cx="50%" cy="50%">
          <PolarGrid
            gridType={gridType}
            stroke={theme.palette.text.secondary}
          />
          <PolarAngleAxis
            dataKey="name"
            style={{ fontSize: theme.typography.body2.fontSize }}
          />
          <PolarRadiusAxis
            orientation="middle"
            style={{
              fill: theme.palette.text.secondary,
              fontSize: theme.typography.body2.fontSize,
              textShadow: "1px 1px 1px rgba(0, 0, 0, 0.85)",
            }}
          />
          <Radar
            name="Amount"
            dataKey="value"
            stroke={color || theme.palette.primary.main}
            fill={color || theme.palette.primary.main}
            fillOpacity={0.5}
            dot={showDots}
          />

          {!!showTooltip && (
            <Tooltip
              contentStyle={{
                color: theme.palette.primary.contrastText,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
              formatter={(value) => [`${value} kr`, "Amount"]}
            />
          )}
        </RechartsRadarChart>
      )}
    </ResponsiveContainer>
  );
}
