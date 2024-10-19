import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  thumbnail,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  thumbnail?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-black border border-white/[0.2] justify-between flex flex-col space-y-4 overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {thumbnail && (
        <div 
          className="w-full h-32 bg-cover bg-center rounded-t-xl"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      )}
      <div className="flex-grow flex flex-col justify-end">
        <div className="font-sans font-bold text-white mb-2">
          {title}
        </div>
        <div className="font-sans font-normal text-white/70 text-xs">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
