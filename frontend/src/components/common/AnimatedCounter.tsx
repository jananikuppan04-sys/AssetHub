import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  formatFn?: (val: number) => string;
  duration?: number;
}

export function AnimatedCounter({ value, formatFn, duration = 1 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration,
      onUpdate(v) {
        setDisplayValue(v);
      },
    });
    return controls.stop;
  }, [value, duration]);

  // Use formatFn if provided (e.g. for currency), otherwise just round
  return <span>{formatFn ? formatFn(displayValue) : Math.round(displayValue).toLocaleString()}</span>;
}
