import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { calcPercentage } from "@src/utils/number-utils";
import theme from "@src/theme/theme";

type GaugeChartProps = {
  value: number;
  limit: number;
};

/* 
  The gauge chart is a bar chart with only one bar.
  The chart is vertically oriented.
  The bar is colored based on the percentage of the value compared to the limit.
  The bar color ranges from hue 120 to hue 0 (green to red).
  If the value is above the limit, the bar color is red.
  If the value is below the limit, the chart ceiling is set to the limit.
  If the value is above the limit, the chart ceiling is set to the value, and a line is drawn at the limit.
*/

function getBarColor(value: number, limit: number) {
  const percentage = calcPercentage(value, limit);

  const max = 0;
  const min = 120;

  const hue = min - (percentage / 100) * (min - max);

  return `hsl(${hue}, 85%, 50%)`;
}

export function GaugeChart({ value, limit }: GaugeChartProps) {
  const data = [
    {
      name: "Spending",
      value,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={64}>
      <RechartsBarChart data={data} layout="vertical">
        <YAxis dataKey="name" type="category" hide />

        {/* Always show where limit is on X-axis */}
        <XAxis type="number" ticks={[0, limit]} />

        <Bar
          dataKey="value"
          fill={getBarColor(value, limit)}
          // label={{
          //   width: 400,
          //   position: "top",
          //   fill: theme.palette.text.primary,
          //   fontSize: "1rem",
          //   fontWeight: "bold",
          //   textAnchor: "start",
          //   formatter: (value: number) => `${value} kr`,
          //   stroke: "black",
          //   strokeWidth: 1,
          // }}
        >
          <LabelList
            dataKey="value"
            position="top"
            content={(props) => renderCustomizedLabel(props, limit)}
          />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

const renderCustomizedLabel = (props, limit) => {
  const { x, y, width, height, value } = props;

  const percentage = calcPercentage(value, limit);

  const offset = percentage > 65 ? 40 : 0;

  return (
    <text
      // x={x + width / 1.975}
      // y={y + height / 2}
      x={x + width - offset}
      y={y + height - 5}
      fill="#fff"
      textAnchor="end"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );

  // const fireOffset = value.toString().length < 5;
  // const offset = fireOffset ? -40 : 5;
  // return (
  //   <text
  //     x={x + width - offset}
  //     y={y + height - 5}
  //     fill={fireOffset ? "#285A64" : "#fff"}
  //     textAnchor="end"
  //   >
  //     {value}
  //   </text>
  // );
};
