'use client';
import { useHomePageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import Image from 'next/image';


const HOME_PAGE_QUERY = gql`
  query HomePage {
    gateways {
      totalCount
    }
    inferenceEndpoints {
      totalCount
    }
    viewer {
      ...Layout_viewer
    }
  }
`;


export default function Home() {
  const { data } = useHomePageSuspenseQuery();

  //@ts-expect-error Type 'undefined' is not assignable to type '{ href: string; title: string; description: string; target?: string | undefined; }'
  const links: Array<{ href: string; title: string; description: string; target?: string; }> = [
    !data.viewer && {
      href: '/login',
      title: 'Login',
      description: 'Login to your account.',
    },
    data.viewer && {
      href: '/gateways',
      title: 'Gateways',
      description: 'Manage your gateways - where your apps connect.',
    },
    data.viewer && {
      href: '/inference-endpoints',
      title: 'Inference Endpoints',
      description: 'Manage your inference endpoints - where your models are deployed.',
    },
    data.viewer && {
      href: '/traces',
      title: 'Traces',
      description: 'Inspect the traces of calls to your gateways.',
    },
    data.viewer && {
      href: '/chat',
      title: 'Chat',
      description: 'Chat with AI models and test prompts.',
    },
    {
      href: 'https://modelgw.com/docs',
      title: 'Docs',
      description: 'Find in-depth information about Model Gateway features and API.',
      target: '_blank',
    },
  ].filter(Boolean);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/img/logo/modelgw.svg"
          alt="Model Gateway"
          width={180}
          height={180}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        {links.map(({ href, title, description, target }) => (
          <a
            key={title}
            href={href}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target={target}
          >
            <h2 className="mb-3 text-2xl font-semibold">
              {title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              {description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
