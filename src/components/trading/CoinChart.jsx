import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity } from 'lucide-react';

const CHART_MAX_POINTS = 40;
const SLIDE_MS = 780;

const CoinChart = React.memo(function CoinChart({
  currentPrice,
  direction = 'long',
  height = 220,
  showGrid = true,
  showLiveBadge = true,
  animated = true,
}) {
  const width = 400;
  const uid = useRef(`coinchart-${Math.random().toString(36).slice(2, 9)}`).current;

  const [points, setPoints] = useState(() => [currentPrice]);
  const [sliding, setSliding] = useState(false);
  const slideTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (currentPrice === undefined || currentPrice === null || Number.isNaN(currentPrice)) return;
    setPoints((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === currentPrice) return prev;
      return [...prev, currentPrice];
    });
  }, [currentPrice]);

  useEffect(() => {
    if (points.length <= CHART_MAX_POINTS) return undefined;

    if (!animated) {
      setPoints((prev) => (prev.length > CHART_MAX_POINTS ? prev.slice(prev.length - CHART_MAX_POINTS) : prev));
      return undefined;
    }

    setSliding(true);
    slideTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setPoints((prev) => (prev.length > CHART_MAX_POINTS ? prev.slice(prev.length - CHART_MAX_POINTS) : prev));
      setSliding(false);
    }, SLIDE_MS);

    return () => {
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
        slideTimeoutRef.current = null;
      }
    };
  }, [points, animated]);

  useEffect(() => {
    return () => {
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
        slideTimeoutRef.current = null;
      }
    };
  }, []);

  const stepX = width / CHART_MAX_POINTS;

  const { path, areaPath, lastPoint, isUp } = useMemo(() => {
    if (points.length < 2) {
      return { path: '', areaPath: '', lastPoint: null, isUp: true };
    }
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const verticalPad = Math.max(8, height * 0.07);

    const coords = points.map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - verticalPad * 2) - verticalPad;
      return [x, y];
    });

    const linePath = coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');

    const lastX = coords[coords.length - 1][0];
    const firstX = coords[0][0];
    const areaPathStr = `${linePath} L${lastX.toFixed(2)},${height} L${firstX.toFixed(2)},${height} Z`;

    return {
      path: linePath,
      areaPath: areaPathStr,
      lastPoint: coords[coords.length - 1],
      isUp: points[points.length - 1] >= points[0],
    };
  }, [points, stepX, height]);

  const strokeColor = direction === 'short' ? '#f43f5e' : isUp ? '#a855f7' : '#f43f5e';
  const groupTransform = `translate(${sliding && animated ? -stepX : 0}, 0)`;

  const gradientId = `${uid}-grad`;
  const glowId = `${uid}-glow`;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-black/30 border border-white/10"
      style={{ height: `${height}px` }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4">
              {animated && (
                <animate
                  attributeName="stop-opacity"
                  values="0.4;0.16;0.4"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showGrid && (
          <>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={`h-${f}`}
                x1="0"
                y1={height * f}
                x2={width}
                y2={height * f}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {[0.2, 0.4, 0.6, 0.8].map((f) => (
              <line
                key={`v-${f}`}
                x1={width * f}
                y1="0"
                x2={width * f}
                y2={height}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
          </>
        )}

        <g
          style={{
            transform: groupTransform,
            transition: sliding && animated ? `transform ${SLIDE_MS}ms linear` : 'none',
          }}
        >
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${glowId})`}
            />
          )}
          {lastPoint && (
            <>
              <circle cx={lastPoint[0]} cy={lastPoint[1]} r="7" fill={strokeColor} opacity="0.25">
                {animated && (
                  <>
                    <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0.25;0.05;0.25"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
              <circle
                cx={lastPoint[0]}
                cy={lastPoint[1]}
                r="3.2"
                fill={strokeColor}
                filter={`url(#${glowId})`}
                stroke="#0d0b18"
                strokeWidth="1.2"
              />
            </>
          )}
        </g>
      </svg>

      {showLiveBadge && (
        <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
          <Activity size={11} />
          Live
        </div>
      )}
    </div>
  );
});

export default CoinChart;
