import { Badge, BadgeButton } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { GatewayRequestFilter, GatewayRequestTable_GatewayRequestsFragment, GatewayRequestTable_GatewaysFragment } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import JsonView from '@uiw/react-json-view';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { flatMap, isObject } from 'lodash';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
  gateways: GatewayRequestTable_GatewaysFragment,
  gatewayRequests: GatewayRequestTable_GatewayRequestsFragment;
  fetchMore: () => void;
  filter: (filter: GatewayRequestFilter) => void;
}

function intersperse(arr: any[], separator: any) {
  return flatMap(arr, (item, index) =>
    index < arr.length - 1 ? [item, separator] : [item]
  );
}

function durationBadgeColor(duration: number) {
  if (duration < 1) return 'green';
  if (duration < 5) return 'lime';
  if (duration < 10) return 'yellow';
  if (duration < 20) return 'amber';
  if (duration < 30) return 'orange';
  return 'red';
}

function statusCodeBadgeColor(statusCode: number) {
  if (statusCode < 300) return 'green';
  if (statusCode < 400) return 'yellow';
  if (statusCode < 500) return 'amber';
  return 'red';
}


type JsonViewerProps = {
  value?: {
    messages?: Array<{
      role?: string;
      content?: string;
    }>;
    choices?: Array<{
      delta?: {
        role?: string;
        content?: string;
      };
      message?: {
        role?: string;
        content?: string;
      };
      finish_reason?: string;
    }>;
  }
}

function CustomJsonViewer({ value: payload }: JsonViewerProps) {
  const lastMessage = payload?.messages?.[payload.messages?.length - 1];
  const hasRoleAndContent = !!(lastMessage?.role && lastMessage?.content);
  const hasChoices = !!(payload?.choices && payload.choices.length > 0);
  let preview: React.ReactNode = '...';
  if (hasRoleAndContent) {
    preview = <span title="Preview">"{lastMessage.role}" &raquo; "{lastMessage.content}"</span>;
  } else if (hasChoices) {
    const choices: Array<React.ReactNode> = [];
    if (payload!.choices![0].delta?.role) {
      choices.push(<>&Delta; role &raquo; "{payload!.choices![0].delta.role}"</>);
    }
    if (payload!.choices![0].delta?.content) {
      choices.push(<>&Delta; content &raquo; "{payload!.choices![0].delta.content}"</>);
    }
    if (payload!.choices![0].message?.content && payload!.choices![0].message?.role) {
      choices.push(<>"{payload!.choices![0].message.role}" &raquo; "{payload!.choices![0].message.content}"</>);
    }
    if (payload!.choices![0].finish_reason) {
      choices.push(<>finish_reason &raquo; "{payload!.choices![0].finish_reason}"</>);
    }
    preview = <span title="Preview">{intersperse(choices, ', ')}</span>;
  }

  const collapsed = (hasRoleAndContent || hasChoices) ? 0 : 3;
  return <JsonView value={payload} displayDataTypes={false} collapsed={collapsed}>
    <JsonView.Ellipsis render={({ 'data-expanded': isExpanded, className, ...props }, { value }) => {
      if (isExpanded) {
        return (
          <span className={clsx('cursor-pointer select-none', className)}>
            {payload == value && preview}
          </span>
        )
      }
      return <></>;
    }}>
    </JsonView.Ellipsis>
  </JsonView>
}

function BodyPreview({ body }: { body: string | null | undefined }) {
  if (body) {
    try {
      const jsonBody = JSON.parse(body);
      if (isObject(jsonBody)) {
        return <CustomJsonViewer value={jsonBody} />
      }
    } catch (e) {
      // try to parse as JSON lines
      const jsonViews: Array<React.ReactNode> = [];
      const lines = body.split('\n');
      for (const line of lines) {
        try {
          const jsonBody = JSON.parse(line.trim());
          if (isObject(jsonBody)) {
            jsonViews.push(<CustomJsonViewer value={jsonBody} />);
          }
        } catch (e) {
          jsonViews.push(<div className="font-mono break-all">{line}</div>);
        }
      }
      return jsonViews;
    }
  }
  return body;

}

export default function GatewayRequestTable({ gateways, gatewayRequests, fetchMore, filter }: Props) {
  const [selectedGatewayRequestIds, setSelectedGatewayRequestIds] = useState<string[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isDirty }, clearErrors } = useForm<GatewayRequestFilter>({
    defaultValues: {
      gatewayId: '',
      createdAt: {
        gte: null,
        lte: null,
      }
    },
  });

  const toggleSelectedGatewayRequest = (id: string) => {
    if (selectedGatewayRequestIds.includes(id)) {
      setSelectedGatewayRequestIds(selectedGatewayRequestIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedGatewayRequestIds([...selectedGatewayRequestIds, id]);
    }
  }

  const submit: SubmitHandler<GatewayRequestFilter> = async (data) => {
    clearErrors();
    filter(data);
  };

  return (<div>
    <form onSubmit={handleSubmit(submit)} method="post">
      <Fieldset className="px-6 pb-4">
        <FieldGroup>
          <div className="flex flex-col md:flex-row gap-2 md:items-end">
            <Field>
              <Label>From</Label>
              <Input {...register('createdAt.gte')} invalid={!!errors.createdAt?.gte} type="datetime-local" step={1} className="!m-0" />
              {errors.createdAt?.gte && <ErrorMessage>{errors.createdAt.gte.message}</ErrorMessage>}
            </Field>
            <Field>
              <Label>To</Label>
              <Input {...register('createdAt.lte')} invalid={!!errors.createdAt?.lte} type="datetime-local" step={1} className="!m-0" />
              {errors.createdAt?.lte && <ErrorMessage>{errors.createdAt.lte.message}</ErrorMessage>}
            </Field>
            <Field>
              <Label>Gateway</Label>
              <Select {...register('gatewayId')} invalid={!!errors.gatewayId} className="!m-0">
                <option value="" key="any">any</option>
                {gateways.edges!.map((gateway) => (
                  <option value={gateway!.node!.id} key={gateway!.node!.id}>{gateway!.node!.name}</option>
                ))}
              </Select>
              {errors.gatewayId && <ErrorMessage>{errors.gatewayId.message}</ErrorMessage>}
            </Field>
            <Button type="submit" color="indigo">Filter</Button>
            {isDirty && <Button type="button" outline onClick={() => reset()}>Reset</Button>}
          </div>
        </FieldGroup>
      </Fieldset>
    </form>
    <table className="min-w-full divide-y divide-gray-300 table-auto">
      <thead>
        <tr>
          <th scope="col" className="relative"> </th>
          <th scope="col" className="text-left text-sm font-semibold">
            Timestamp
          </th>
          <th scope="col" className="text-left text-sm font-semibold">
            Gateway Requests
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-content">
        {gatewayRequests.edges?.length === 0 && <tr><td></td><td colSpan={2}>No traces found</td></tr>}
        {gatewayRequests.edges?.map((edge) => (<>
          <tr
            key={edge!.node!.id}
            className={selectedGatewayRequestIds.includes(edge!.node!.id) ? 'bg-zinc-100 dark:bg-gray-700' : undefined}
          >
            <th
              className="px-2 pt-1 text-left text-sm font-semibold cursor-pointer w-1 align-top"
              onClick={() => toggleSelectedGatewayRequest(edge!.node!.id)}
            >
              {selectedGatewayRequestIds.includes(edge!.node!.id) ? '⏷' : '⏵'}
            </th>
            <td className="whitespace-nowrap py-1 text-sm w-1 align-top">{dayjs(parseInt(edge!.node!.createdAt)).format('YYYY-MM-DD HH:mm:ss.SSS')}</td>
            <td className="py-1 text-sm">
              <BadgeButton href={`/gateways/${edge!.node!.gateway.id}`} color="zinc" className="mr-1" title="Gateway">⛩️ {edge!.node!.gateway.name}</BadgeButton>
              <Badge color="zinc" className="mr-1" title="Gateway Key">🔑 {edge!.node!.gatewayKey.name}</Badge>
              {edge!.node!.tools && <Badge color="zinc" className="mr-1" title="Tools">🛠️</Badge>}
              {edge!.node!.stream && <Badge color="zinc" className="mr-1" title="Streamed">🎞️</Badge>}
              {edge!.node!.temperature && <Badge color="zinc" className="mr-1" title="Temperature">🌡️ {edge!.node!.temperature}</Badge>}
              {edge!.node!.gatewayResponse && <>
                <Badge color={statusCodeBadgeColor(edge!.node!.gatewayResponse.statusCode)} className="mr-1" title="Status code">{edge!.node!.gatewayResponse.statusCode}</Badge>
                <Badge color={durationBadgeColor(edge!.node!.gatewayResponse.duration)} className="mr-1" title="Duration in seconds">⏱️ {edge!.node!.gatewayResponse.duration.toFixed(2)}</Badge>
              </>}
              {(edge!.node!.gatewayResponse?.inferenceEndpointResponse?.promptTokens || edge!.node!.gatewayResponse?.inferenceEndpointResponse?.completionTokens) &&
                <Badge color="zinc" className="mr-1" title="Prompt Tokens / Completion Tokens">
                  🪙 ⬆️ {edge!.node!.gatewayResponse.inferenceEndpointResponse.promptTokens ?? '?'}
                  {' '}⬇️ {edge!.node!.gatewayResponse.inferenceEndpointResponse.completionTokens ?? '?'}
                </Badge>}
              {edge!.node!.url}
            </td>
          </tr>
          {selectedGatewayRequestIds.includes(edge!.node!.id) && <>
            <tr>
              <td colSpan={3} className="p-1">
                <div className="text-xs">
                  <Badge color="zinc" className="mr-1">Request</Badge>
                  <BodyPreview body={edge!.node?.body} />
                </div>
              </td>
            </tr>
            {edge!.node!.gatewayResponse && <tr>
              <td colSpan={3} className="p-1">
                <div className="text-xs inline">
                  <Badge color="zinc" className="mr-1">Response</Badge>
                  {edge!.node!.gatewayResponse.inferenceEndpointResponse?.inferenceEndpointRequest?.inferenceEndpoint &&
                    <BadgeButton
                      href={`/inference-endpoints/${edge!.node!.gatewayResponse.inferenceEndpointResponse.inferenceEndpointRequest.inferenceEndpoint.id}`}
                      color="zinc"
                      className="mr-1"
                      title="Inference Endpoint"
                    >
                      🎯 {edge!.node!.gatewayResponse.inferenceEndpointResponse.inferenceEndpointRequest.inferenceEndpoint.name}
                    </BadgeButton>}
                  <BodyPreview body={edge!.node!.gatewayResponse.body} />
                </div>
              </td>
            </tr>}
          </>}
        </>))}
      </tbody>
    </table>
    <div className="flex justify-center">
      <Button onClick={() => fetchMore()} outline className="mt-4">Load More</Button>
    </div>
  </div>
  )
}

GatewayRequestTable.fragments = {
  gateways: gql`
    fragment GatewayRequestTable_gateways on GatewayConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  `,
  gatewayRequests: gql`
    fragment GatewayRequestTable_gatewayRequests on GatewayRequestConnection {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          url
          body
          contentType
          requestId
          tools
          stream
          temperature
          maxTokens
          createdAt
          gateway {
            id
            name
          }
          gatewayKey {
            name
          }
          gatewayResponse {
            id
            duration
            statusCode
            headers
            body
            createdAt
            inferenceEndpointResponse {
              promptTokens
              completionTokens
              inferenceEndpointRequest {
                id
                inferenceEndpoint {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `
}
