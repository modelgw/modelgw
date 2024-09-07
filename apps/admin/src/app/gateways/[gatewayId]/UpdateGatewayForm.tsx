'use client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/ui/Checkbox';
import { Description, ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { OnlineStatus } from '@/components/ui/OnlineStatus';
import { Text } from '@/components/ui/Text';
import { UpdateGatewayForm_GatewayFragment, UpdateGatewayForm_InferenceEndpointsFragment, UpdateGatewayInput, UpdateGatewayMutationFn } from '@/generated/graphql-client';
import { PLATFORM_LIST } from '@/lib/const';
import { invalidateForm } from '@/lib/form';
import { gql } from '@apollo/client';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { env } from 'next-runtime-env';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';


type Props = React.PropsWithChildren<{
  gateway: UpdateGatewayForm_GatewayFragment;
  inferenceEndpoints: UpdateGatewayForm_InferenceEndpointsFragment;
  onSubmit: UpdateGatewayMutationFn;
  loading?: boolean;
  className?: string;
}>;

export default function UpdateGatewayForm({ gateway, inferenceEndpoints, onSubmit, loading, className }: Props) {
  const [multiplatform, setMultiplatform] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty }, setError, clearErrors, control, watch, setValue, reset } = useForm<UpdateGatewayInput>({
    defaultValues: {
      gatewayId: gateway?.id,
      name: gateway?.name,
      traceTraffic: gateway?.traceTraffic,
      tracePayload: gateway?.tracePayload,
      logTraffic: gateway?.logTraffic,
      logPayload: gateway?.logPayload,
      inferenceEndpointIds: gateway?.inferenceEndpoints?.edges?.map(edge => edge?.node?.id) ?? [],
    },
  });
  const traceTrafficWatch = watch('traceTraffic');
  const logTrafficWatch = watch('logTraffic');
  const inferenceEndpointIdsWatch = watch('inferenceEndpointIds');
  useEffect(() => {
    if (inferenceEndpointIdsWatch) {
      const platforms = new Set();
      inferenceEndpointIdsWatch.forEach((id: string) => {
        const platform = inferenceEndpoints.edges!.find(edge => edge!.node!.id === id)!.node!.platform;
        platforms.add(platform);
      });
      setMultiplatform(platforms.size > 1);
    }
  }, [inferenceEndpointIdsWatch]);

  const submit: SubmitHandler<UpdateGatewayInput> = async (data) => {
    clearErrors();
    const result = await onSubmit({
      variables: {
        input: {
          ...data,
          logPayload: data.logPayload && logTrafficWatch,
        },
      },
      onError: invalidateForm(setError, ['name', 'inferenceEndpointIds']),
    });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className={clsx(className, 'flex flex-col gap-y-10')}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input {...register('name')} invalid={!!errors.name} />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </Field>
          <Field>
            <Label>Gateway Endpoint</Label>
            <Input value={env('NEXT_PUBLIC_GATEWAY_URL')} readOnly />
          </Field>
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Tracing</Legend>
        <Text>Persist requests and responses traces in Model Gateway. Traces are stored in the database.</Text>
        <CheckboxGroup>
          <CheckboxField>
            <Controller name="traceTraffic" control={control} render={({ field }) => (
              <Checkbox
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
              />
            )} />
            <Label>Trace traffic</Label>
            <Description>Trace traffic but not the payload. Keep track of requests and responses while preserving privacy by omitting the payload.</Description>
          </CheckboxField>
          <CheckboxField disabled={!traceTrafficWatch}>
            <Controller name="tracePayload" control={control} render={({ field }) => (
              <Checkbox
                name={field.name}
                checked={field.value && traceTrafficWatch}
                onChange={field.onChange}
              />
            )} />
            <Label>Trace payload</Label>
            <Description>Include request and response payloads in traces. Sensitive data might appear in the traces if present in the payload.</Description>
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Logging</Legend>
        <Text>How to log requests and responses in Model Gateway. Logs are written in standard output.</Text>
        <CheckboxGroup>
          <CheckboxField>
            <Controller name="logTraffic" control={control} render={({ field }) => (
              <Checkbox
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
              />
            )} />
            <Label>Log traffic</Label>
            <Description>Log traffic but not the payload. Keep track of requests and responses but preserve privacy by omitting the payload.</Description>
          </CheckboxField>
          <CheckboxField disabled={!logTrafficWatch}>
            <Controller name="logPayload" control={control} render={({ field }) => (
              <Checkbox
                name={field.name}
                checked={field.value && logTrafficWatch}
                onChange={field.onChange}
              />
            )} />
            <Label>Log payload</Label>
            <Description>Include request and response payloads in the logs. Sensitive data may appear in the log if present in the payload.</Description>
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Inference Enpoints</Legend>
        <Controller name="inferenceEndpointIds" control={control} render={({ field }) => (
          <CheckboxGroup className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
            {inferenceEndpoints.edges!.map(edge => (
              <CheckboxField key={edge!.node!.id}>
                <Checkbox
                  value={edge!.node!.id}
                  checked={field.value.includes(edge!.node!.id)}
                  onChange={(checked) => field.onChange(checked ? [...field.value, edge!.node!.id] : field.value.filter((id: string) => id !== edge!.node!.id))}
                />
                <Label>{edge!.node!.name}</Label>
                <div className="ml-8">
                  <Badge>{PLATFORM_LIST.find(p => p.value == edge!.node!.platform)!.name}</Badge>
                  <OnlineStatus status={edge!.node!.status} />
                </div>
              </CheckboxField>
            ))}
          </CheckboxGroup>
        )}
        />
        {errors.inferenceEndpointIds && <ErrorMessage>{errors.inferenceEndpointIds.message}</ErrorMessage>}
        {multiplatform && <div className="text-warning text-base/6 sm:text-sm/6 pt-5">
          <ExclamationTriangleIcon className="w-5 h-5 inline mr-2" />
          Multiple platforms selected. Ensure you are using an API compatible with all of them.
        </div>}
      </Fieldset>
      <div className="flex justify-end gap-x-2">
        <Button type="submit" color="indigo" disabled={loading}>Save</Button>
      </div>
    </form >
  );
}

UpdateGatewayForm.fragments = {
  gateway: gql`
    fragment UpdateGatewayForm_gateway on Gateway {
      id
      name
      traceTraffic
      tracePayload
      logTraffic
      logPayload
      inferenceEndpoints {
        edges {
          node {
            id
          }
        }
      }
    }
  `,
  inferenceEndpoints: gql`
    fragment UpdateGatewayForm_inferenceEndpoints on InferenceEndpointConnection {
      edges {
        node {
          id
          name
          platform
          status
        }
      }
    }
  `,
};
