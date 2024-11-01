'use client';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Field, FieldGroup, Fieldset, Label } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ChatPageQuery, useChatPageSuspenseQuery } from '@/generated/graphql-client';
import { GetDeepProp } from '@/lib/types';
import { gql } from '@apollo/client';
import { CoreMessage, Thread, useEdgeRuntime } from "@assistant-ui/react";
import { env } from 'next-runtime-env';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { convertOllamaChatRequestToCoreMessages } from '../ollama-utils';


const CHAT_PAGE_QUERY = gql`
  query ChatPage($gatewayRequestId: ID!, $loadRequest: Boolean = false) {
    viewer {
      ...Layout_viewer
    }
    gatewayRequest: node(id: $gatewayRequestId) @include(if: $loadRequest) {
      ... on GatewayRequest {
        id
        body
        inferenceEndpointRequests {
          edges {
            node {
              inferenceEndpoint {
                id
                platform
              }
            }
          }
        }
      }
    }
    inferenceEndpoints {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;


export default function ChatPage({ params }: { params: { gatewayRequestId?: string[] } }) {
  const { data } = useChatPageSuspenseQuery({
    variables: {
      gatewayRequestId: params.gatewayRequestId?.[0] || 'dummy',
      loadRequest: !!params.gatewayRequestId,
    }
  });
  type GatewayRequest = Extract<GetDeepProp<ChatPageQuery, 'gatewayRequest'>, { __typename?: 'GatewayRequest' }>;
  const gatewayRequest = data.gatewayRequest as GatewayRequest | undefined;
  const requestBody = gatewayRequest?.body ? JSON.parse(gatewayRequest.body) : {};

  let initialMessages: CoreMessage[] | undefined = undefined;
  if (gatewayRequest?.inferenceEndpointRequests?.edges?.[0]?.node!.inferenceEndpoint.platform === 'OLLAMA') {
    initialMessages = convertOllamaChatRequestToCoreMessages(requestBody);
  } else {
    initialMessages = requestBody.messages;
  }

  const defaultInferenceEndpointId = gatewayRequest?.inferenceEndpointRequests?.edges?.[0]?.node!.inferenceEndpoint.id ?? data.inferenceEndpoints!.edges?.[0]?.node!.id;
  const [inferenceEndpointId, setInferenceEndpointId] = useState<string | undefined>(defaultInferenceEndpointId);
  const [modelName, setModelName] = useState<string>(requestBody.model);
  const [systemMessage, setSystemMessage] = useState<string | undefined>(initialMessages?.find(m => m.role === 'system')?.content[0].text);

  const runtime = useEdgeRuntime({
    api: env('NEXT_PUBLIC_CHAT_URL')!,
    initialMessages,
    credentials: 'include',
    body: {
      get modelgw() {
        return {
          inferenceEndpointId,
          modelName,
        }
      }
    },
  });

  if (!data.viewer) return redirect('/login');

  const inferenceEndpoints = data.inferenceEndpoints!.edges?.map((edge) => ({
    id: edge!.node!.id,
    name: edge!.node!.name,
  }));

  const startNewConversation = () => {
    const firstUserMsg = runtime.thread.getState().messages.find(m => m.role === 'user');
    runtime.switchToNewThread();
    if (systemMessage) {
      runtime.thread.append({
        role: 'system',
        content: [{ type: 'text', text: systemMessage ?? '' }],
      });
    }
    if (firstUserMsg) {
      //@ts-expect-error 'audio' is declared here.
      runtime.thread.append(firstUserMsg);
    }
  };

  return (
    <Layout viewer={data.viewer} fullWidth>
      <SectionHeading title="Chat" className="mb-5" buttons={[{ content: 'Back', href: '/' }]} />
      {!inferenceEndpoints || inferenceEndpoints.length == 0 && <>
        <EmptyState title="No inference endpoints" href="/inference-endpoints/create" />
      </>}
      {inferenceEndpoints && inferenceEndpoints.length > 0 && <div className="flex gap-4 w-full">
        <div className="flex-grow h-full">
          <Thread runtime={runtime} />
        </div>
        <div className="flex-grow-0 w-1/4">
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Inference&nbsp;endpoint</Label>
                <Select value={inferenceEndpointId} onChange={(e) => setInferenceEndpointId(e.target.value)}>
                  {inferenceEndpoints.map((key) => (
                    <option value={key!.id} key={key!.id}>{key!.name}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Model</Label>
                <Input value={modelName} onChange={(e) => setModelName(e.target.value)} />
              </Field>
              <Field>
                <Label>System message</Label>
                <Textarea value={systemMessage} onChange={(e) => setSystemMessage(e.target.value)} rows={8} className="mb-2" />
                <Button onClick={startNewConversation}>Set and restart conversation</Button>
              </Field>
            </FieldGroup>
          </Fieldset>
        </div>
      </div>}
    </Layout>
  );
}
