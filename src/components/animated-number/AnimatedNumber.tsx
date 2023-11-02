import {
  UseAnimatedNumberProps,
  useAnimatedNumber,
} from "@src/hooks/useAnimatedNumber";
import { CSSProperties } from "react";

type AnimatedNumberProps = {
  color?: string;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  suffix?: string;
} & UseAnimatedNumberProps;

export function AnimatedNumber({
  from,
  to,
  duration,
  delay,
  easing,
  fractions,
  color,
  fontSize,
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
    <span
      style={{
        display: "inline-block",
        color: color ?? "inherit",
        fontWeight: fontWeight ?? "inherit",
        fontSize: fontSize ?? "inherit",
      }}
    >
      {animatedValue}
      {suffix}
    </span>
  );
}
