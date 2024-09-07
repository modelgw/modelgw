import clsx from 'clsx';

type Props = {
  status: string,
  innerColor?: string,
  outerColor?: string,
  className?: string,
}

export function OnlineStatus({ status, innerColor = 'bg-gray-500', outerColor = 'bg-gray-500/20', className }: Props) {
  return (
    <div className={className}>
      <div className="mt-1 flex items-center gap-x-1.5">
        <div className={clsx('flex-none rounded-full p-1', {
          'bg-emerald-500/20': status == 'ACTIVE',
          'bg-red-500/20': status == 'ERROR',
          'bg-amber-500/20': status == 'THROTTLING',
          'bg-zinc-500/20': status == 'INACTIVE',
          [outerColor]: status != 'ACTIVE' && status != 'ERROR' && status != 'THROTTLING' && status != 'INACTIVE',
        })}>
          <div className={clsx('h-1.5 w-1.5 rounded-full', {
            'bg-emerald-500': status == 'ACTIVE',
            'bg-red-500': status == 'ERROR',
            'bg-amber-500': status == 'THROTTLING',
            'bg-zinc-500': status == 'INACTIVE',
            [innerColor]: status != 'ACTIVE' && status != 'ERROR' && status != 'THROTTLING' && status != 'INACTIVE',
          })} />
        </div>
        <p className="text-xs leading-5 text-gray-500">
          {status == 'ACTIVE' && 'Active'}
          {status == 'ERROR' && 'Error'}
          {status == 'THROTTLING' && 'Throttling'}
          {status == 'INACTIVE' && 'Inactive'}
          {status != 'ACTIVE' && status != 'ERROR' && status != 'THROTTLING' && status != 'INACTIVE' && status}
        </p>
      </div>
    </div>
  );
}
