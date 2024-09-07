'use client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from '@/components/ui/Toast';
import { UpdateGatewayInput, UpdateGatewayKeysForm_GatewayFragment, UpdateGatewayKeysForm_GatewayKeysFragment, useAddGatewayKeyMutation, useRevokeGatewayKeyMutation } from '@/generated/graphql-client';
import { invalidateForm } from '@/lib/form';
import { gql } from '@apollo/client';
import { clsx } from 'clsx';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';


const ADD_GATEWAY_KEY = gql`
  mutation AddGatewayKey($input: AddGatewayKeyInput!) {
    addGatewayKey(input: $input) {
      gatewayKey {
        id
        name
        maskedKey
        status
      }
      key
    }
  }
`;

const REVOKE_GATEWAY_KEY = gql`
  mutation RevokeGatewayKey($input: RevokeGatewayKeyInput!) {
    revokeGatewayKey(input: $input) {
      gatewayKey {
        id
        name
        maskedKey
        status
      }
    }
  }
`;

type Props = React.PropsWithChildren<{
  gateway: UpdateGatewayKeysForm_GatewayFragment;
  gatewayKeys: UpdateGatewayKeysForm_GatewayKeysFragment;
  className?: string;
}>;

export default function UpdateGatewayKeysForm({ gateway, gatewayKeys, className }: Props) {
  const [showSecretKeyDialog, setShowSecretKeyDialog] = useState(false);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  const [showRevokeKeyDialog, setShowRevokeKeyDialog] = useState(false);
  const [keyToBeRevoked, setKeyToBeRevoked] = useState<{ gatewayKeyId: string, maskedKey: string }>();

  const [revokeGatewayKeyMutation, { loading: revokeGatewayKeyLoading }] = useRevokeGatewayKeyMutation();

  const [addGatewayKeyMutation, { loading: addGatewayKeyLoading }] = useAddGatewayKeyMutation();
  const { register, handleSubmit, formState: { errors, isDirty }, setError, clearErrors, control, watch, setValue, reset } = useForm<UpdateGatewayInput>({
    defaultValues: {
      gatewayId: gateway.id,
      name: '',
    },
  });

  const submit: SubmitHandler<UpdateGatewayInput> = async (data) => {
    clearErrors();
    const result = await addGatewayKeyMutation({
      variables: { input: data },
      onError: invalidateForm(setError, ['name']),
      refetchQueries: ['GatewayPage'],
    });
    if (result.data?.addGatewayKey?.key) {
      setSecretKey(result.data.addGatewayKey.key);
      setShowSecretKeyDialog(true);
      reset();
    }
  };
  const confirmRevoke = (gatewayKeyId: string, maskedKey: string) => {
    setKeyToBeRevoked({ gatewayKeyId, maskedKey });
    setShowRevokeKeyDialog(true);
  };
  const revoke = async (gatewayKeyId: string) => {
    await revokeGatewayKeyMutation({
      variables: { input: { gatewayKeyId } },
      onError: () => toast('error', 'Failed to revoke key'),
      onCompleted: () => toast('success', 'Key revoked!'),
      refetchQueries: ['GatewayPage'],
    });
    setShowRevokeKeyDialog(false);
  };
  return (
    <div className="flex flex-col gap-y-5">
      {gatewayKeys.totalCount == 0 && <div className="text-content-secondary italic content p-5">No keys found.</div>}
      {gatewayKeys.totalCount > 0 && <div className="content p-5">
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Key</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {gatewayKeys.edges!.map(edge => (
              <TableRow key={edge!.node!.id}>
                <TableCell className="text-zinc-500">{edge!.node!.name}</TableCell>
                <TableCell className="text-zinc-500">{edge!.node!.maskedKey}</TableCell>
                <TableCell className="text-zinc-500">
                  {edge!.node!.status === 'ACTIVE' && <Badge color="green">Active</Badge>}
                  {edge!.node!.status === 'REVOKED' && <Badge color="zinc">Revoked</Badge>}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {edge!.node!.status === 'ACTIVE' && <Button color="red" onClick={() => confirmRevoke(edge!.node!.id, edge!.node!.maskedKey)}>Revoke</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>}

      <form onSubmit={handleSubmit(submit)} className={clsx(className, 'p-5 content flex flex-col gap-y-10')}>
        <Fieldset>
          <Legend>Add Gateway API Key</Legend>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input {...register('name')} invalid={!!errors.name} />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </Field>
          </FieldGroup>
        </Fieldset>
        <div className="flex justify-end gap-x-2">
          <Button type="submit" color="indigo" disabled={addGatewayKeyLoading}>Add</Button>
        </div>
      </form>

      <Dialog open={showSecretKeyDialog} onClose={setShowSecretKeyDialog}>
        <DialogTitle>Secret key added</DialogTitle>
        <DialogDescription>
          Please save this secret key. For security reasons, you won&apos;t be able to view it again. If you lose this secret key, you&apos;ll need to generate a new one.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Secret key</Label>
            <Input name="key" value={secretKey ?? ''} readOnly />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowSecretKeyDialog(false)} color="indigo">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showRevokeKeyDialog} onClose={setShowRevokeKeyDialog}>
        <DialogTitle>Revoke secret key</DialogTitle>
        <DialogDescription>
          Are you sure you want to immediately disable this key?
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Secret key</Label>
            <Input name="key" value={keyToBeRevoked?.maskedKey ?? ''} readOnly />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowRevokeKeyDialog(false)} color="white">Close</Button>
          <Button onClick={() => revoke(keyToBeRevoked!.gatewayKeyId)} color="red">Revoke</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

UpdateGatewayKeysForm.fragments = {
  gatewayKeys: gql`
    fragment UpdateGatewayKeysForm_gatewayKeys on GatewayKeyConnection {
      totalCount
      edges {
        node {
          id
          name
          maskedKey
          status
        }
      }
    }
  `,
  gateway: gql`
    fragment UpdateGatewayKeysForm_gateway on Gateway {
      id
    }
  `,
};
