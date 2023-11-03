import { useState, useEffect } from "react";

type UseElementDimensionsProps = {
  ref: React.RefObject<HTMLElement>;
};

type ElementDimensions = {
  width: number;
  height: number;
};

export const useElementDimensions = ({
  ref,
}: UseElementDimensionsProps): ElementDimensions => {
  const [dimensions, setDimensions] = useState<ElementDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};
