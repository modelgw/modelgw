import clsx from 'clsx';
import { Button } from './Button';


type Button = {
  content: React.ReactNode,
  primary?: boolean,
  href: string,
}

type Props = {
  title: string,
  className?: string,
  buttons?: Button[],
}

export default function SectionHeading({ title, buttons, className }: Props) {
  return (
    <div className={clsx('border-b border-content pb-5 sm:flex sm:items-center sm:justify-between', className)}>
      <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
      <div className="mt-3 flex sm:ml-4 sm:mt-0 gap-4">
        {buttons?.map((button, index) => (
          <Button key={index} href={button.href} color={button.primary ? 'indigo' : 'light'}>
            {button.content}
          </Button>
        ))}
      </div>
    </div>
  )
}
