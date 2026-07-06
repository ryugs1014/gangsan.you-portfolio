// components/layout/Container.tsx

import { ReactNode } from 'react';
import s from './Container.module.scss';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = '',
}: ContainerProps) {
  return (
    <div className={`${s['container']} ${className}`.trim()}>{children}</div>
  );
}
