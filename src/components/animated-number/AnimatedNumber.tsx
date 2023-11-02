import { Typography } from "@mui/material";
import {
  UseAnimatedNumberProps,
  useAnimatedNumber,
} from "@src/hooks/useAnimatedNumber";
import { ComponentProps } from "react";

type AnimatedNumberProps = {
  variant?: ComponentProps<typeof Typography>["variant"];
  color?: ComponentProps<typeof Typography>["color"];
  fontWeight?: ComponentProps<typeof Typography>["fontWeight"];
  suffix?: string;
} & UseAnimatedNumberProps;

export function AnimatedNumber({
  from,
  to,
  duration,
  delay,
  easing,
  fractions,
  variant = "body1",
  color,
  fontWeight,
  suffix,
}: AnimatedNumberProps) {
  const animatedValue = useAnimatedNumber({
    from,
    to,
    duration,
    fractions,
    delay,
    easing,
  });

  return (
    <Typography
      variant={variant}
      color={color}
      fontWeight={fontWeight}
      display="inline-block"
    >
      {animatedValue}
      {suffix}
    </Typography>
  );
}
