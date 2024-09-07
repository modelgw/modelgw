'use client';

import clsx from 'clsx';

type Props = React.PropsWithChildren<{
  title: React.ReactNode,
  description?: React.ReactNode,
  className?: string,
}>;

export default function TwoColumnLayoutSection({ title, description, className, children }: Props) {
  return (
    <div className={clsx('grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3', className)}>
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral">
          {description}
        </p>
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
};
