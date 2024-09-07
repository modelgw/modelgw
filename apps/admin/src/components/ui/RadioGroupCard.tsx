import { RadioGroup, RadioGroupProps } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';


export function RadioCardGroup({ className, ...props }: { invalid?: boolean } & React.PropsWithChildren & RadioGroupProps) {

  return (
    <RadioGroup value={props.value} onChange={props.onChange}>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {props.children}
      </div>
    </RadioGroup>
  )
}


export function RadioCard({ className, ...props }: { invalid?: boolean } & React.PropsWithChildren & RadioGroupProps) {
  return (
    <RadioGroup.Option
      key={props.key}
      value={props.value}
      className={({ focus, checked }) =>
        clsx(
          focus ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300',
          'relative flex cursor-pointer rounded-lg border bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none',
          props.invalid ? 'border-red-500' : '',
          checked ? 'bg-indigo-50 dark:bg-indigo-900' : '',
        )
      }
    >
      {({ checked, focus }) => (
        <>
          <span className="flex flex-1">
            <span className="flex flex-col">
              {props.children}
            </span>
          </span>
          <CheckCircleIcon
            className={clsx(!checked ? 'invisible' : '', 'h-5 w-5 text-indigo-600 dark:text-indigo-400')}
            aria-hidden="true"
          />
          <span
            className={clsx(
              focus ? 'border' : 'border-2',
              checked ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent',
              'pointer-events-none absolute -inset-px rounded-lg'
            )}
            aria-hidden="true"
          />
        </>
      )}
    </RadioGroup.Option>
  );
}