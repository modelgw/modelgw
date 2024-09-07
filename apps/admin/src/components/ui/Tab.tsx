import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { Fragment } from 'react';


export function Tab({ children, className, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <HeadlessTab
      as={Fragment}
    >
      {({ hover, selected }) => (
        <button
          {...props}
          className={clsx(
            selected
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
          )}>{children}</button>
      )}
    </HeadlessTab>
  )
}

export function TabList({ children, className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <HeadlessTabList
      as={Fragment}
    >
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8"
          {...props}
          aria-label="Tabs"
        >
          {children}
        </nav>
      </div>
    </HeadlessTabList>
  )
}

export function TabGroup({ className, ...props }: React.ComponentPropsWithoutRef<typeof HeadlessTabGroup>) {
  return (
    <HeadlessTabGroup as="div"
      {...props}
      className={className}
    />
  )
}

export function TabPanel({ className, ...props }: React.ComponentPropsWithoutRef<typeof HeadlessTabPanel>) {
  return (
    <HeadlessTabPanel
      {...props}
      className={className}
    />
  )
}


export function TabPanels({ className, ...props }: React.ComponentPropsWithoutRef<typeof HeadlessTabPanels>) {
  return (
    <HeadlessTabPanels
      {...props}
      className={className}
    />
  )
}


