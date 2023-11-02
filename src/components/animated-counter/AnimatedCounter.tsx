import { ComponentProps, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Stack, Typography } from "@mui/material";

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const NUMBER_HEIGHT = 24;

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  damping?: number;
  stiffness?: number;
  variant?: ComponentProps<typeof Typography>["variant"];
  fontWeight?: ComponentProps<typeof Typography>["fontWeight"];
  color?: ComponentProps<typeof Typography>["color"];
  suffix?: string;
};

export function AnimatedCounter({
  value,
  duration = 5,
  damping = 10,
  stiffness = 1000,
  variant,
  fontWeight,
  color,
  suffix,
}: AnimatedCounterProps) {
  const numbers = value.toString().split("");

  const typographyProps = useMemo(
    () => ({
      variant: variant ?? "inherit",
      fontWeight: fontWeight ?? "inherit",
      color: color ?? "inherit",
    }),
    [variant, fontWeight, color]
  );

  return (
    <Typography
      component="span"
      height={NUMBER_HEIGHT}
      display="inline-flex"
      overflow="hidden"
      {...typographyProps}
    >
      {numbers.map((number, index) => (
        <ScrollingNumber
          key={index}
          value={Number(number)}
          duration={duration}
          damping={damping}
          stiffness={stiffness}
        />
      ))}
      {!!suffix && (
        <Typography ml={0.3} component="span" {...typographyProps}>
          {suffix}
        </Typography>
      )}
    </Typography>
  );
}

type ScrollingNumberProps = {
  value: number;
  duration: number;
  damping: number;
  stiffness: number;
};

function ScrollingNumber({
  value,
  duration,
  damping,
  stiffness,
}: ScrollingNumberProps) {
  const [animatedValue, setAnimatedValue] = useState(9);

  useEffect(() => {
    const difference = value - animatedValue;
    let frame = 0;
    const animationDuration = duration;

    const animate = () => {
      const newValue = animatedValue + (difference / animationDuration) * frame;
      setAnimatedValue(newValue);

      frame += 1;
      if (frame <= animationDuration) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, animatedValue, duration]);

  return (
    <motion.span
      style={{ y: -animatedValue * NUMBER_HEIGHT }}
      initial={{ y: 0 }}
      animate={{ y: -animatedValue * NUMBER_HEIGHT }}
      transition={{ type: "spring", damping, stiffness }}
    >
      {NUMBERS.map((number) => (
        <Stack component="span" key={number} height={NUMBER_HEIGHT}>
          {number}
        </Stack>
      ))}
    </motion.span>
  );
}
