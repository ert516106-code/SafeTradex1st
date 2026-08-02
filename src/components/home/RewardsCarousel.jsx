import React, { useState, useEffect, useRef } from 'react';

const slidesData = [
  // Slide 1
  [
    { title: 'REFER & EARN', value: '20%', sub: 'Commission', btn: 'Invite Friends', gold: true },
    { title: 'LEARN & EARN', value: 'Candlestick', sub: 'Risk Management', btn: 'Start Learning', green: true },
    { title: 'DAILY CHECK-IN', value: 'Day 3 +50', sub: "Today's Reward", btn: 'Claim Now' },
  ],
  // Slide 2
  [
    { title: 'TRADING CHALLENGE', value: '$10,000', sub: 'Reward Pool · Rank #15', btn: 'Join Challenge' },
    { title: 'VIP REWARDS', value: '⭐ VIP', sub: 'Lower Fees · Priority Support', btn: 'View Now' },
    { title: 'MYSTERY BOX', value: '🎁', sub: 'Open every 24h', btn: 'Open Box' },
  ],
  // Slide 3
  [
    { title: 'CASHBACK', value: '5%', sub: 'Weekend trading', btn: 'See Cashback', green: true },
    { title: 'NEW USER MISSION', value: '100 USDT', sub: 'Progress 3/4', btn: 'Claim Rewards' },
    { title: 'AI MARKET INSIGHT', value: '📈 Bullish', sub: 'BTC ETF record inflows', btn: 'Read More' },
  ],
  // Slide 4
  [
    { title: 'ACHIEVEMENT', value: '2,540 pts', sub: 'Level 2 · 460 pts left', btn: 'View All' },
    { title: 'STAKING REWARDS', value: '$12,642', sub: '8.50% APY', btn: 'Stake Now', green: true },
    { title: 'TRENDING COINS', value: 'BTC +0.87%', sub: 'ETH +1.76% · SOL +2.19%', btn: 'Explore' },
  ],
];

export default function RewardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  const totalSlides = slidesData.length;

  const goToSlide = (index) => {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    setCurrentIndex(index);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(nextSlide, 30000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    stopAutoPlay();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
    startAutoPlay();
  };

  const mouseDownX = useRef(0);
  const isMouseDown = useRef(false);

  const handleMouseDown = (e) => {
    mouseDownX.current = e.clientX;
    isMouseDown.current = true;
    stopAutoPlay();
  };

  const handleMouseUp = (e) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const diff = mouseDownX.current - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) startAutoPlay();
      else stopAutoPlay();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.carouselContainer}>
        <div
          ref={trackRef}
          style={{
            ...styles.track,
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={(e) => {
            if (isMouseDown.current) {
              isMouseDown.current = false;
              startAutoPlay();
            }
          }}
        >
          {slidesData.map((slide, slideIndex) => (
            <div key={slideIndex} style={styles.slide}>
              {slide.map((card, cardIndex) => (
                <div key={cardIndex} style={styles.card}>
                  <div>
                    <div style={styles.cardTitle}>{card.title}</div>
                    <div
                      style={{
                        ...styles.cardValue,
                        ...(card.gold && styles.gold),
                        ...(card.green && styles.green),
                      }}
                    >
                      {card.value}
                    </div>
                    <div style={styles.cardSub}>{card.sub}</div>
                  </div>
                  <button
                    style={{
                      ...styles.cardBtn,
                      ...(card.green && styles.cardBtnGreen),
                    }}
                  >
                    {card.btn}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.dotsContainer}>
        {slidesData.map((_, idx) => (
          <span
            key={idx}
            style={{
              ...styles.dot,
              ...(idx === currentIndex && styles.dotActive),
            }}
            onClick={() => {
              stopAutoPlay();
              goToSlide(idx);
              startAutoPlay();
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    margin: '16px 0 20px',
  },
  carouselContainer: {
    overflow: 'hidden',
    borderRadius: '18px',
    position: 'relative',
  },
  track: {
    display: 'flex',
    transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform',
    cursor: 'grab',
    userSelect: 'none',
  },
  slide: {
    minWidth: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
    padding: '2px 0',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(4px)',
    borderRadius: '16px',
    padding: '14px 10px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#b0c4de',
    letterSpacing: '0.3px',
    lineHeight: '1.3',
  },
  cardValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '4px 0',
  },
  gold: {
    color: '#f5b342',
  },
  green: {
    color: '#34c77b',
  },
  cardSub: {
    fontSize: '11px',
    color: '#7a8ba3',
  },
  cardBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'none',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '6px 0',
    borderRadius: '40px',
    marginTop: '6px',
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cardBtnGreen: {
    background: '#34c77b',
    color: '#050816',
  },
  dotsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '14px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    transition: '0.3s',
    cursor: 'pointer',
  },
  dotActive: {
    background: '#34c77b',
    width: '24px',
    borderRadius: '20px',
  },
};
