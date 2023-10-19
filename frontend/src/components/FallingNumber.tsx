// components/FallingNumber.tsx

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FallingNumber = ({ number }: { number: number }) => {
  const [y, setY] = useState(-100);
  const [x, setX] = useState(0);

  useEffect(() => {
    setX(Math.random() * window.innerWidth);
    const interval = setInterval(() => {
      setY(window.innerHeight);
    }, 3000); // Adjust the falling speed as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      style={{ x, y }}
      transition={{ duration: 3 }}
      className="absolute text-4xl text-white"
    >
      {number}
    </motion.div>
  );
};

export default FallingNumber;
