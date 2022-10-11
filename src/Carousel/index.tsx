import React, { ReactElement, cloneElement, useCallback, useEffect, useRef } from 'react';

type DefaultRecordType = Record<string, any>;

interface CarouselProps<RecordType = unknown> extends xyData {
  children: ReactElement[];
  height: number;
  width: number;
  autoPlay?: boolean;
  farScale?: number;
}

interface itemProps<RecordType = unknown> {
  rotation: number;
  xOrigin: number;
  yOrigin: number;
  xRadius: number;
  yRadius: number;
  farScale: number;
  destRotation?: number;
}

interface xyData {
  xOrigin?: number;
  yOrigin?: number;
  xRadius?: number;
  yRadius?: number;
}

const cancelFrame = window.cancelAnimationFrame;
const requestFrame = window.requestAnimationFrame;

function time() {
  return performance.now();
}

function moveTo(item: HTMLElement, x: number, y: number, scale: number) {
  const style = item.style;
  style.zIndex = `${(scale * 100) | 0}`;

  style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
}

function renderItem(
  item: HTMLElement,
  { rotation, farScale, xOrigin, yOrigin, xRadius, yRadius }: itemProps,
) {
  const sin = Math.sin(rotation);
  const scale = farScale + (1 - farScale) * (sin + 1) * 0.5;

  moveTo(
    item,
    xOrigin + scale * (Math.cos(rotation) * xRadius - item.offsetHeight * 0.5),
    yOrigin + scale * sin * yRadius,
    scale,
  );
}

function render(
  items: HTMLCollection,
  { rotation, farScale, xOrigin, yOrigin, xRadius, yRadius }: itemProps,
) {
  const count = items.length;
  const spacing = (2 * Math.PI) / count;
  let radians = rotation;

  for (let i = 0; i < count; i++) {
    renderItem(items[i] as HTMLElement, {
      rotation: radians,
      farScale,
      xOrigin,
      yOrigin,
      xRadius,
      yRadius,
    });
    radians += spacing;
  }
}

function itemsRotated(itemCount: number, rotation: number) {
  return (itemCount * (Math.PI / 2 - rotation)) / (2 * Math.PI);
}

function floatIndex(itemCount: number, rotation: number) {
  var count = itemCount;
  var floatIndex = itemsRotated(itemCount, rotation) % count;

  // Make sure float-index is positive
  return floatIndex < 0 ? floatIndex + count : floatIndex;
}

// Spin the carousel.  Count is the number (+-) of carousel items to rotate
function go(count: number, destRotation: number, itemCount: number) {
  return (destRotation += ((2 * Math.PI) / itemCount) * count);
}

function play(
  destRotation: number,
  rotation: number,
  speed: number,
  fn: (rotation: number, timer: number) => void,
) {
  let timer = 0;
  let lastTime = 0;

  if (timer === 0) scheduleNextFrame();

  function playFrame() {
    var rem = destRotation - rotation;
    var now = time();
    var dt = (now - lastTime) * 0.002;
    lastTime = now;

    if (Math.abs(rem) < 0.003) {
      rotation = destRotation;
      cancelFrame(timer);
      timer = 0;
    } else {
      // Rotate asymptotically closer to the destination
      rotation = destRotation - rem / (1 + speed * dt);
      scheduleNextFrame();
    }

    fn(rotation, timer);
  }

  function scheduleNextFrame() {
    lastTime = time();

    timer = requestFrame(playFrame);
  }
}

function xy(box: HTMLDivElement, data: xyData) {
  const boxWidth = box.offsetWidth || 0;
  const boxHeight = box.offsetHeight || 0;
  const xOrigin = data.xOrigin || boxWidth * 0.5;
  const yOrigin = data.yOrigin || boxHeight * 0.1;
  const xRadius = data.xRadius || boxWidth / 2.3;
  const yRadius = data.yRadius || boxHeight / 6;

  return { xOrigin, yOrigin, xRadius, yRadius };
}

function content(items: ReactElement[], onClick: React.MouseEventHandler<HTMLElement>) {
  const style = {
    display: 'inline-block',
    position: 'absolute',
    transformOrigin: '0 0',
  };
  return items.map((item, index) => {
    return cloneElement(item, { index, onClick, style: { ...item.props.style, ...style } });
  });
}

function Carousel<RecordType extends DefaultRecordType>(props: CarouselProps<RecordType>) {
  const { children, height, width, autoPlay } = props;
  const boxRef = useRef<HTMLDivElement>(null);
  const playTimer = useRef<number>(0);
  const rotation = useRef<number>(Math.PI / 2);
  const destRotation = useRef<number>(Math.PI / 2);
  const farScale = 0.5;
  const speed = 4;

  const carousel = useCallback((index: number) => {
    destRotation.current = go(index, destRotation.current, children.length);

    play(destRotation.current, rotation.current, speed, (data, timer) => {
      if (!boxRef.current) return;

      playTimer.current = timer;
      rotation.current = data;
      const { xOrigin, yOrigin, xRadius, yRadius } = xy(boxRef.current as HTMLDivElement, props);
      render(boxRef.current?.children as HTMLCollection, {
        rotation: data,
        farScale,
        xOrigin,
        yOrigin,
        xRadius,
        yRadius,
      });
    });
  }, []);

  useEffect(() => {
    let autoPlayTimer: number;
    const children = boxRef.current?.children || [];
    const { xOrigin, yOrigin, xRadius, yRadius } = xy(boxRef.current as HTMLDivElement, props);

    render(children as HTMLCollection, {
      rotation: rotation.current,
      farScale,
      xOrigin,
      yOrigin,
      xRadius,
      yRadius,
    });

    if (autoPlay) {
      autoPlayTimer = setInterval(function () {
        carousel(1);
      }, 2000);
    }

    return () => {
      clearInterval(autoPlayTimer);
      cancelFrame(playTimer.current);
    };
  }, []);

  const itemClick = useCallback((e: React.BaseSyntheticEvent) => {
    const idx = e.currentTarget.getAttribute('index');
    const count = children.length;

    let diff = idx - (floatIndex(count, rotation.current) % count);

    if (!diff) return;

    // Normalise "diff" to represent the shortest way to rotate item to front
    if (2 * Math.abs(diff) > count) diff += diff > 0 ? -count : count;

    // Suppress default browser action if the item isn't roughly in front
    if (Math.abs(diff) > 0.5) e.preventDefault();

    carousel(-diff);
  }, []);

  return (
    <div onClick={(e) => {}} ref={boxRef} style={{ position: 'relative', height, width }}>
      {content(children, itemClick)}
    </div>
  );
}

export default Carousel;
