import { Badge } from '@/components/ui/Badge';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import { StackedList, StackedListItem } from '@/components/ui/StackedList';
import { InferenceEndpointList_InferenceEndpointsFragment } from '@/generated/graphql-client';
import { PLATFORM_LIST } from '@/lib/const';
import { gql } from '@apollo/client';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';

export type InferenceEndpointListProps = {
  inferenceEndpoints: InferenceEndpointList_InferenceEndpointsFragment;
}
export default function InferenceEndpointList({ inferenceEndpoints }: InferenceEndpointListProps) {
  return (
    <StackedList>
      {inferenceEndpoints.edges!.map(edge => (
        <StackedListItem key={edge!.node!.id}>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="font-semibold leading-6">
                <a href={`/inference-endpoints/${edge!.node!.id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {edge!.node!.name}
                </a>
              </p>
              <div className="mt-1 flex leading-5 space-x-1">
                <Badge>{PLATFORM_LIST.find(p => p.value == edge?.node?.platform)?.name}</Badge>
                {edge?.node?.region && <Badge>
                  <MapPinIcon className="h-4 w-4 flex-none" aria-hidden="true" /><span>{edge.node.region}</span>
                </Badge>}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <OnlineStatus status={edge!.node!.status} />
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
        </StackedListItem>
      ))}
    </StackedList >
  )
}

InferenceEndpointList.fragments = {
  inferenceEndpoints: gql`
    fragment InferenceEndpointList_inferenceEndpoints on InferenceEndpointConnection {
      edges {
        node {
          id
          name
          platform
          region
          endpoint
          status
        }
      }
    }
  `};