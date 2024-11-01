import { Layout_ViewerFragment, useLogoutMutation } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, PropsWithChildren } from 'react';
import Gravatar from 'react-gravatar';
import { Toaster } from './Toast';


const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

type Props = PropsWithChildren<{
  fullWidth?: boolean;
  viewer?: Layout_ViewerFragment;
}>;

export default function Layout({ fullWidth, viewer, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [logout] = useLogoutMutation();

  const navigation = [
    { name: 'Gateways', href: '/gateways' },
    { name: 'Inference Endpoints', href: '/inference-endpoints' },
    { name: 'Traces', href: '/traces' },
    { name: 'Chat', href: '/chat' },
  ];
  const userNavigation = [
    {
      name: 'Sign out', href: '#', onClick: () => {
        logout({
          onCompleted: () => router.push('/'),
        });
      }
    },
  ];

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow-sm">
          {({ open }) => (
            <>
              <div className={clsx('mx-auto', fullWidth ? 'px-2' : 'max-w-7xl px-4 sm:px-6 lg:px-8')}>
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <a href='/'>
                        <img
                          className="block h-8 w-auto lg:hidden dark:invert"
                          src="/img/logo/modelgw.svg"
                          alt="Model Gateway"
                        />
                        <img
                          className="hidden h-8 w-auto lg:block dark:invert"
                          src="/img/logo/modelgw.svg"
                          alt="Model Gateway"
                        />
                      </a>
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            pathname.startsWith(item.href)
                              ? 'border-indigo-500 text-gray-900 dark:text-gray-100'
                              : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200',
                            'inline-flex items-center border-b-2 px-1 pt-1 font-medium'
                          )}
                          aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  {viewer && <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          {viewer && <Gravatar email={viewer.email} rating="pg" default="monsterid" className="h-8 w-8 rounded-full" />}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  onClick={item.onClick}
                                  className={clsx(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>}
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={clsx(
                        pathname.startsWith(item.href)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )}
                      aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {viewer && <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      {viewer && <Gravatar email={viewer.email} rating="pg" default="monsterid" className="h-10 w-10 rounded-full" />}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Toaster />

        <div className="py-10">
          <main>
            <div className={clsx('mx-auto', fullWidth ? 'px-2' : 'max-w-7xl sm:px-6 lg:px-8')}>{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

Layout.fragments = {
  viewer: gql`
    fragment Layout_viewer on Viewer {
      id
      email
    }
  `};
