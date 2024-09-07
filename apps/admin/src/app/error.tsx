'use client';
import { ApolloError } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';

export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  const router = useRouter();
  if (error instanceof ApolloError && error.graphQLErrors.length > 0 && error.graphQLErrors[0].extensions?.code === 'UNAUTHORIZED') {
    return redirect('/login?message=UNAUTHORIZED');
  }

  return (
    <div className="bg-content text-content">
      <h2>❌ Unexpected error!</h2>
      <p>{error.name} {error.message}</p>
      <p>{error instanceof ApolloError && error.message == 'Failed to fetch' && 'Model Gateway Management endpoint unreachable from the ' + (typeof window == 'undefined' ? 'server' : 'browser')}</p>
    </div>
  );
}