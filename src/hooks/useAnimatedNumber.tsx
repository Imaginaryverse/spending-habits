import { useEffect, useState } from "react";
import { EasingDefinition, animate } from "framer-motion";

export type UseAnimatedNumberProps = {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  easing?: EasingDefinition;
  fractions?: number;
};

export function useAnimatedNumber({
  from,
  to,
  duration = 3,
  delay = 0,
  easing = "easeOut",
  fractions = 0,
}: UseAnimatedNumberProps) {
  const [animatedValue, setAnimatedValue] = useState(from);

  useEffect(() => {
    const controls = animate(animatedValue, to, {
      duration: duration / 10,
      delay,
      ease: easing,
      onUpdate: (latest) =>
        setAnimatedValue(Number.parseFloat(latest.toFixed(fractions))),
    });

    return () => controls.stop();
  }, [animatedValue, to, duration, delay, easing, fractions]);

  return animatedValue;
}
