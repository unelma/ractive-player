import {constrain} from './misc';

// animation
export function animate(options: {
  startValue?: number,
  endValue?: number,
  startTime: number,
  duration: number,
  easing?: (x: number) => number
}) {
  if (!('startValue' in options)) options.startValue = 0;
  if (!('endValue' in options)) options.endValue = 1;
  if (!('easing' in options)) options.easing = (x: number) => x;
  const {startValue, endValue, startTime, duration, easing} = options;
  return (t: number) => startValue + easing(constrain(0, (t - startTime) / duration, 1)) * (endValue - startValue);
}

export type ReplayData<K> = [number, K][];

interface ReplayArgs<K> {
  data: ReplayData<K>;
  start?: number;
  end?: number;
  active: (current: K, index: number) => void;
  inactive: () => void;
}

export function replay<K>({data, start, end, active, inactive}: ReplayArgs<K>): (t: number) => void {
  const times = data.map(d => d[0]);
  for (let i = 1; i < times.length; ++i)
    times[i] += times[i-1];

  if (typeof start === 'undefined') start = 0;
  if (typeof end === 'undefined') end = start + times[times.length - 1];

  let lastTime = 0,
      i = 0,
      lastI = null;

  function listener(t: number) {
    if (t < lastTime) i = 0;
    lastTime = t;

    if (t < start || t >= end) {
      return inactive();
    }

    let maxI = Math.min(i, times.length - 1);

    for (; i < times.length; i++) {
      if (start + times[i] < t) maxI = i;
      else break;
    }
    
    const [, current] = data[maxI];

    active(current, maxI);
  }
  
  return listener;
}

export const easings = {
  easeInSine: [0.47, 0, 0.745, 0.715],
  easeOutSine: [0.39, 0.575, 0.565, 1],
  easeInOutSine: [0.445, 0.05, 0.55, 0.95],
  easeInQuad: [0.55, 0.085, 0.68, 0.53],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
  easeInCubic: [0.55, 0.055, 0.675, 0.19],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeInQuart: [0.895, 0.03, 0.685, 0.22],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeInOutQuart: [0.77, 0, 0.175, 1],
  easeInQuint: [0.755, 0.05, 0.855, 0.06],
  easeOutQuint: [0.23, 1, 0.32, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  easeInExpo: [0.95, 0.05, 0.795, 0.035],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutExpo: [1, 0, 0, 1],
  easeInCirc: [0.6, 0.04, 0.98, 0.335],
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
  easeInBack: [0.6, -0.28, 0.735, 0.045],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55]
};