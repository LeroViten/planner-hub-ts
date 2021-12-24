import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

export default function MoveRightHover({ x = 0, timing = 150, children }) {
  const [isHovered, setIsHovered] = useState(false);

  const style = useSpring({
    display: 'inline-block',
    backfaceVisibility: 'hidden',
    transform: isHovered ? `translateX(${x}px)` : `translateX(0px)`,
    config: {
      tension: 300,
      friction: 10,
    },
  });

  useEffect(() => {
    if (!isHovered) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setIsHovered(false);
    }, timing);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isHovered, timing]);

  const trigger = () => {
    setIsHovered(true);
  };

  return (
    <animated.div onMouseEnter={trigger} style={style}>
      {children}
    </animated.div>
  );
}
