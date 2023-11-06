import { ChartData } from "@src/utils/data-utils";
import { CustomTooltipContainer } from "./CustomChart";
import { Stack, Typography } from "@mui/material";
import { formatNumber } from "@src/utils/number-utils";

type TooltipWithCategoriesProps = {
  data?: ChartData;
  valueKey?: keyof Pick<ChartData, "amount" | "accumulatedAmount">;
  dateKeyFormatter?: (date: string) => string;
};

export function TooltipWithCategories({
  data,
  valueKey = "amount",
  dateKeyFormatter,
}: TooltipWithCategoriesProps) {
  if (!data) {
    return null;
  }

  const { dateKey, categorySummary } = data;

  const value: number = data[valueKey] ?? 0;
  const valueLabel: string = valueKey === "amount" ? "amount" : "accumulated";

  return (
    <CustomTooltipContainer>
      <Typography variant="body2" fontWeight="bold">
        {dateKeyFormatter ? dateKeyFormatter(dateKey) : dateKey}
      </Typography>

      <Typography variant="body2">
        {valueLabel}: <b>{formatNumber(value)} kr</b>
      </Typography>

      {valueKey === "amount" && <CategoriesList categories={categorySummary} />}
    </CustomTooltipContainer>
  );
}

type CategoriesListProps = {
  categories: { name: string; amount: number }[];
};

export function CategoriesList({ categories }: CategoriesListProps) {
  if (!categories?.length) {
    return null;
  }

  return (
    <Stack pt={1} width="100%">
      {categories?.map((category, idx) => (
        <Typography key={idx} variant="body2">
          {category.name.replace(".", "")}:{" "}
          <b>{formatNumber(category.amount)} kr</b>
        </Typography>
      ))}
    </Stack>
  );
}
