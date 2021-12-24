import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

export default function WobbleHover({ rotation = 0, timing = 150, children }) {
  const [isHovered, setIsHovered] = useState(false);

  const style = useSpring({
    display: 'inline-block',
    backfaceVisibility: 'hidden',
    transform: isHovered ? `rotate(${rotation}deg)` : `rotate(0deg)`,
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
    <animated.span onMouseEnter={trigger} style={style}>
      {children}
    </animated.span>
  );
}
