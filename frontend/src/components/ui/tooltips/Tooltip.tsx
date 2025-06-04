import React, { useState } from 'react';
import { HelpCircleIcon } from 'lucide-react';

interface TooltipProps {
  text: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  widthClass?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  className = '',
  position = 'top',
  widthClass = 'w-max max-w-[200px] sm:max-w-xs md:max-w-sm' // Ajuste aqui
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700 dark:border-t-gray-900',
    bottom: 'absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-700 dark:border-b-gray-900',
    left: 'absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-gray-700 dark:border-l-gray-900',
    right: 'absolute top-1/2 -translate-y-1/2 right-full w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-700 dark:border-r-gray-900',
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
    >
      <HelpCircleIcon className="size-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help" />
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white
            bg-gray-700 rounded-lg shadow-lg dark:bg-gray-900
            ${widthClass}
            ${positionClasses[position]}
            break-words
          `}
        >
          {text}
          <div className={arrowClasses[position]}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;