'use client';
import { Button } from '@/components/ui/Button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import TwoColumnLayoutSection from '@/components/ui/TwoColumnLayoutSection';
import { CreateGatewayInput, CreateGatewayMutationFn } from '@/generated/graphql-client';
import { invalidateForm } from '@/lib/form';
import { SubmitHandler, useForm } from 'react-hook-form';


type Props = React.PropsWithChildren<{
  onSubmit: CreateGatewayMutationFn;
  loading?: boolean;
}>;

export default function GatewayForm({ onSubmit, loading }: Props) {
  const { register, handleSubmit, formState: { errors, isDirty }, setError, clearErrors, control, watch, setValue, reset } = useForm<CreateGatewayInput>({
    defaultValues: {
      name: '',
    },
  });

  const submit: SubmitHandler<CreateGatewayInput> = async (data) => {
    clearErrors();
    const result = await onSubmit({
      variables: { input: data },
      onError: invalidateForm(setError, ['name']),
      onCompleted: () => reset(),
    });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-5">
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
      </TwoColumnLayoutSection>
      <div className="flex justify-end gap-x-2 py-4">
        <Button type="submit" color="indigo" disabled={loading}>Save</Button>
      </div>
    </form >
  );
}
