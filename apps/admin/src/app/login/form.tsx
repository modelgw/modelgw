'use client';
import { Button } from '@/components/ui/Button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { LoginInput, useLoginMutation } from '@/generated/graphql-client';
import { invalidateForm } from '@/lib/form';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

export default function LoginForm() {
  const router = useRouter()
  const [login, { loading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    const response = await login({
      variables: { input: data },
      onError: invalidateForm(setError, ['email', 'password']),
    });
    if (response.data?.login?.token) {
      window.location.href = '/';
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto dark:invert"
          src="/img/logo/modelgw.svg"
          alt="Model Gateway"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-neutral">
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-content px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} method="post">
            <Fieldset className="p-6">
              <FieldGroup>
                <Field>
                  <Label>Email</Label>
                  <Input {...register('email')} invalid={!!errors.email} type="email" />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </Field>
                <Field>
                  <Label>Password</Label>
                  <Input {...register('password')} invalid={!!errors.password} type="password" />
                  {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </Field>
                <Button type="submit" color="indigo" disabled={loading} className="w-full">Login</Button>
              </FieldGroup>
            </Fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
