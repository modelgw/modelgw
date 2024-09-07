'use client';
import { Button } from '@/components/ui/Button';
import { Description, ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { Radio, RadioField, RadioGroup } from '@/components/ui/Radio';
import { RadioCard, RadioCardGroup } from '@/components/ui/RadioGroupCard';
import { Select } from '@/components/ui/Select';
import TwoColumnLayoutSection from '@/components/ui/TwoColumnLayoutSection';
import { CreateInferenceEndpointInput, CreateInferenceEndpointMutationFn, InferenceEndpointForm_InferenceEndpointFragment, UpdateInferenceEndpointInput, UpdateInferenceEndpointMutationFn } from '@/generated/graphql-client';
import { PLATFORM_LIST, Platform } from '@/lib/const';
import { invalidateForm } from '@/lib/form';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';


type Props = React.PropsWithChildren<{
  inferenceEndpoint?: InferenceEndpointForm_InferenceEndpointFragment;
  onSubmit: UpdateInferenceEndpointMutationFn | CreateInferenceEndpointMutationFn;
  loading?: boolean;
}>;

export default function InferenceEndpointForm({ inferenceEndpoint, onSubmit, loading }: Props) {
  const [platform, setPlatform] = useState<Platform | null>(PLATFORM_LIST.find(p => p.value === inferenceEndpoint?.platform) ?? null);
  const [modelNames, setModelNames] = useState<string[]>(platform?.models?.map(m => m.name).filter((x, i, a) => a.indexOf(x) === i).sort() ?? []);
  const [modelVersions, setModelVersions] = useState<string[]>(platform?.models?.filter(m => m.name === inferenceEndpoint?.modelName).map(m => m.version) ?? []);
  const { register, handleSubmit, formState: { errors, isDirty }, setError, clearErrors, control, watch, setValue, reset } = useForm<CreateInferenceEndpointInput | UpdateInferenceEndpointInput>({
    defaultValues: {
      inferenceEndpointId: inferenceEndpoint?.id,
      name: inferenceEndpoint?.name,
      platform: inferenceEndpoint?.platform ?? '',
      region: inferenceEndpoint?.region,
      endpoint: inferenceEndpoint?.endpoint,
      deploymentName: inferenceEndpoint?.deploymentName,
      modelName: inferenceEndpoint?.modelName ?? '',
      modelVersion: inferenceEndpoint?.modelVersion ?? '',
      key: '',
    },
  });
  const watchPlatform = watch('platform');
  const watchModelName = watch('modelName');
  useEffect(() => {
    if (watchPlatform) {
      const platform = PLATFORM_LIST.find(p => p.value === watchPlatform)!;
      setPlatform(platform);
      setModelNames(platform.models?.map(m => m.name).filter((x, i, a) => a.indexOf(x) === i).sort() ?? []);
      clearErrors();
    }
  }, [watchPlatform]);
  useEffect(() => {
    if (watchModelName) {
      setModelVersions(platform?.models?.filter(m => m.name === watchModelName).map(m => m.version) ?? []);
    }
    if (isDirty) {
      setValue('modelVersion', ''); // reset modelVersion when modelName changes
    }
  }, [watchModelName]);

  const submit: SubmitHandler<CreateInferenceEndpointInput | UpdateInferenceEndpointInput> = async (data) => {
    clearErrors();
    const result = await onSubmit({
      //@ts-expect-error Property 'inferenceEndpointId' is missing in type 'CreateInferenceEndpointInput' but required in type 'UpdateInferenceEndpointInput'
      variables: { input: data },
      onError: invalidateForm(setError, ['name', 'platform', 'region', 'endpoint', 'modelName', 'modelVersion', 'key', 'deploymentName']),
      onCompleted: () => setValue('key', ''),
    });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-5" method="post">
      <TwoColumnLayoutSection title="General">
        <Fieldset className="p-6">
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input {...register('name')} invalid={!!errors.name} />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset className="p-6">
          <Field>
            <Label>Platform</Label>
            <Controller name="platform" control={control} render={({ field }) => (
              <RadioGroup value={field.value} onChange={field.onChange}>
                {PLATFORM_LIST.map((platform) => (
                  <RadioField key={platform.value}>
                    <Radio value={platform.value} color="indigo" />
                    <Label>{platform.name}</Label>
                  </RadioField>
                ))}
              </RadioGroup>
            )}
            />
            {errors.platform && <ErrorMessage>{errors.platform.message}</ErrorMessage>}
          </Field >
        </Fieldset>

        {platform?.deploymentName && <Fieldset className="p-6">
          <FieldGroup>
            <Field>
              <Label>Deployment name</Label>
              <Input {...register('deploymentName')} invalid={!!errors.deploymentName} />
              {errors.deploymentName && <ErrorMessage>{errors.deploymentName.message}</ErrorMessage>}
            </Field>
          </FieldGroup>
        </Fieldset>}

        {platform?.regions &&
          <Fieldset className="p-6">
            <Legend>Region</Legend>
            <Field>
              <Controller name="region" control={control} render={({ field }) => (
                <RadioCardGroup name="region" value={field.value ?? ''} onChange={field.onChange} invalid={!!errors.region}>
                  {platform.regions?.map((region) => (
                    <RadioCard key={region.name} value={region.value} invalid={!!errors.region}>
                      <Description className="block text-sm font-medium">{region.name}</Description>
                      <Description>{region.value}</Description>
                      <Description className="mt-1 flex items-center text-sm text-gray-500">
                        <img src={`/img/flags/4x3/${region.flag}.svg`} className="inline-block w-5 h-5 mr-2" />
                        {region.country}
                      </Description>
                    </RadioCard>
                  ))}
                </RadioCardGroup>
              )}
              />
              {errors.region && <ErrorMessage>{errors.region.message}</ErrorMessage>}
            </Field>
          </Fieldset>}

        {modelNames.length > 0 && <>
          <Fieldset className="p-6">
            <Legend>Model</Legend>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Name</Label>
                  <Select {...register('modelName')} invalid={!!errors.modelName}>
                    <option value="" disabled>Select model&hellip;</option>
                    {modelNames.map((model) => (
                      <option value={model} key={model}>{model}</option>
                    ))}
                  </Select>
                  {errors.modelName && <ErrorMessage>{errors.modelName.message}</ErrorMessage>}
                </Field>
                <Field>
                  <Label>Version</Label>
                  <Select {...register('modelVersion')} invalid={!!errors.modelVersion}>
                    <option value="" disabled>Select version&hellip;</option>
                    {modelVersions.map((version) => (
                      <option value={version} key={version}>{version}</option>
                    ))}
                  </Select>
                  {errors.modelVersion && <ErrorMessage>{errors.modelVersion.message}</ErrorMessage>}
                </Field>
              </div>
            </FieldGroup>
          </Fieldset>
        </>}
      </TwoColumnLayoutSection >

      <TwoColumnLayoutSection title="Endpoint and credentials">
        <Fieldset className="p-6">
          <FieldGroup>
            <Field>
              <Label>Endpoint</Label>
              <Input {...register('endpoint')} invalid={!!errors.endpoint} />
              {errors.endpoint && <ErrorMessage>{errors.endpoint.message}</ErrorMessage>}
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>API Key</Label>
              <Input {...register('key')} invalid={!!errors.key} type="password" />
              {errors.key && <ErrorMessage>{errors.key.message}</ErrorMessage>}
            </Field>
          </FieldGroup>
        </Fieldset>
      </TwoColumnLayoutSection>
      <div className="flex justify-end gap-x-2 py-4">
        <Button type="submit" color="indigo" disabled={loading}>Save</Button>
      </div>
    </form >
  );
}

InferenceEndpointForm.fragments = {
  inferenceEndpoint: gql`
    fragment InferenceEndpointForm_inferenceEndpoint on InferenceEndpoint {
      id
      name
      platform
      region
      endpoint
      modelName
      modelVersion
      deploymentName
    }
  `,
};
