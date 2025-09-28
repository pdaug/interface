import { useEffect, useState } from "react";

export type AnimationCountProps = {
  value: number;
  duration?: number;
  isPercent?: boolean;
  formatter?: (value: number) => string;
};

const AnimationCount = function ({
  value,
  duration = 1000,
  isPercent = false,
  formatter,
}: AnimationCountProps) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const start = 0;
    const end = isPercent ? Number(value) * 100 : Number(value);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // interpolação suave
      const current = Math.round(start + (end - start) * progress);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setFinished(true);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  if (finished && formatter) {
    return <span>{formatter(value)}</span>;
  }

  return (
    <span>
      {formatter ? formatter(isPercent ? count / 100 : count) : count}
    </span>
  );
};

export default AnimationCount;
