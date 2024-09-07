import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import reactHotToast, { Toaster as ReactHotToaster } from 'react-hot-toast';

const styles = {
  success: {
    icon: <CheckCircleIcon className="h-6 w-6 text-success" aria-hidden="true" />
  },
  error: {
    icon: <ExclamationCircleIcon className="h-6 w-6 text-error" aria-hidden="true" />
  },
}

export function toast(
  style: keyof typeof styles,
  title: string,
  message?: string,
  options?: Parameters<typeof reactHotToast.custom>[1],
) {
  reactHotToast.custom((t) => (<>
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-content shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {styles[style].icon}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-content">{title}</p>
            <p className="mt-1 text-sm text-content">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-content text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => reactHotToast.dismiss(t.id)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  ), options)
}

export function Toaster() {
  return (
    <div><ReactHotToaster position="top-right" /></div>
  );
}
