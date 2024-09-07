'use client';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import { StackedList, StackedListItem } from '@/components/ui/StackedList';
import { GatewayList_GatewaysFragment } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { ChevronRightIcon } from '@heroicons/react/20/solid';


export type GatewayListProps = {
  gateways: GatewayList_GatewaysFragment;
}
export default function GatewayList({ gateways }: GatewayListProps) {
  return (
    <StackedList>
      {gateways.edges!.map(edge => (
        <StackedListItem key={edge!.node!.id}>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="font-semibold leading-6 XXXtext-gray-900">
                <a href={`/gateways/${edge!.node!.id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {edge!.node!.name}
                </a>
              </p>
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
    </StackedList>
  )
}

GatewayList.fragments = {
  gateways: gql`
    fragment GatewayList_gateways on GatewayConnection {
      edges {
        node {
          id
          name
          status
        }
      }
    }
  `};