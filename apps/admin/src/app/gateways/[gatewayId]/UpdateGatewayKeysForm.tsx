'use client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from '@/components/ui/Toast';
import { AddGatewayKeyInput, UpdateGatewayKeysForm_GatewayFragment, UpdateGatewayKeysForm_GatewayKeysFragment, useAddGatewayKeyMutation, useResetGatewayKeyUsageMutation, useRevokeGatewayKeyMutation } from '@/generated/graphql-client';
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
      gatewayKeys {
        id
        name
        maskedKey
        status
      }
    }
  }
`;

const RESET_GATEWAY_KEY_USAGE = gql`
  mutation ResetGatewayKeyUsage($input: ResetGatewayKeyUsageInput!) {
    resetGatewayKeyUsage(input: $input) {
      gatewayKey {
        promptTokens
        completionTokens
        lastResetAt
      }
    }
  }
`;

type Props = React.PropsWithChildren<{
  gateway: UpdateGatewayKeysForm_GatewayFragment;
  gatewayKeys: UpdateGatewayKeysForm_GatewayKeysFragment;
  className?: string;
}>;

type HierarchicalNode = { id: string, name: string, parent?: HierarchicalNode | null };
function getGatewayKeySortKeyAndLevel(nodeList: HierarchicalNode[], node: HierarchicalNode, parentIds: string[] = []): { sortKey: string, level: number } {
  const parent = nodeList.find(n => n.id === node.parent?.id);
  if (parent) {
    return getGatewayKeySortKeyAndLevel(nodeList, parent, [...parentIds, node.name]);
  } else {
    return {
      sortKey: [...parentIds, node.name].reverse().join('/'),
      level: parentIds.length,
    };
  }
}

export default function UpdateGatewayKeysForm({ gateway, gatewayKeys, className }: Props) {

  const gatewayKeysWithSortKey = gatewayKeys.edges!.map((edge, index) => ({
    ...edge,
    ...getGatewayKeySortKeyAndLevel(gatewayKeys.edges!.map(e => e!.node!), edge!.node!)
  }));
  const sortedGatewayKeys = gatewayKeysWithSortKey!.sort((a, b) => a!.sortKey.localeCompare(b!.sortKey));

  const [showSecretKeyDialog, setShowSecretKeyDialog] = useState(false);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  const [showRevokeKeyDialog, setShowRevokeKeyDialog] = useState(false);
  const [keyToBeRevoked, setKeyToBeRevoked] = useState<{ gatewayKeyId: string, maskedKey: string }>();

  const [resetGatewayKeyUsageMutation] = useResetGatewayKeyUsageMutation();
  const [revokeGatewayKeyMutation, { loading: revokeGatewayKeyLoading }] = useRevokeGatewayKeyMutation();

  const [addGatewayKeyMutation, { loading: addGatewayKeyLoading }] = useAddGatewayKeyMutation();
  const { register, handleSubmit, formState: { errors, isDirty }, setError, clearErrors, control, watch, setValue, reset } = useForm<AddGatewayKeyInput>({
    defaultValues: {
      gatewayId: gateway.id,
      name: '',
      parentGatewayKeyId: '',
      completionTokensLimit: null,
      promptTokensLimit: null,
      resetFrequency: null,
    },
  });
  const watchParentGatewayKeyId = watch('parentGatewayKeyId');

  const submit: SubmitHandler<AddGatewayKeyInput> = async (data) => {
    clearErrors();
    const result = await addGatewayKeyMutation({
      variables: {
        input: {
          ...data,
          parentGatewayKeyId: data.parentGatewayKeyId || undefined,
          resetFrequency: data.resetFrequency || undefined,
        }
      },
      onError: invalidateForm(setError, ['name', 'parentGatewayKeyId', 'promptTokensLimit', 'completionTokensLimit', 'resetFrequency']),
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
  const resetLimit = async (gatewayKeyId: string) => {
    await resetGatewayKeyUsageMutation({
      variables: { input: { gatewayKeyId } },
      onError: () => toast('error', 'Failed to reset limits'),
      onCompleted: () => toast('success', 'Limits reset!'),
      refetchQueries: ['GatewayPage'],
    });
  }
  const revoke = async (gatewayKeyId: string) => {
    await revokeGatewayKeyMutation({
      variables: { input: { gatewayKeyId } },
      onError: () => toast('error', 'Failed to revoke key'),
      onCompleted: (data) => {
        const count = data.revokeGatewayKey!.gatewayKeys.length;
        toast('success', `${count} key${count == 1 ? '' : 's'} revoked!`);
      },
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
              <TableHeader>Usage / Limits</TableHeader>
              <TableHeader>Limits reset</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedGatewayKeys.map(edge => (
              <TableRow key={edge!.node!.id}>
                <TableCell className="text-zinc-500" indent={edge!.level}>{edge!.node!.name}</TableCell>
                <TableCell className="text-zinc-500">{edge!.node!.maskedKey}</TableCell>
                <TableCell className="text-zinc-500">
                  {edge!.node!.status === 'ACTIVE' && <Badge color="green">Active</Badge>}
                  {edge!.node!.status === 'REVOKED' && <Badge color="zinc">Revoked</Badge>}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {edge!.node!.status === 'ACTIVE' && <div className="flex gap-2">{' '}
                    <Badge color={edge!.node!.promptTokens >= (edge!.node!.promptTokensLimit ?? Infinity) ? 'red' : 'green'}>
                      Prompt: {edge!.node!.promptTokens} / {edge!.node!.promptTokensLimit ? edge!.node!.promptTokensLimit : <>&infin;</>}
                    </Badge>
                    <Badge color={edge!.node!.completionTokens >= (edge!.node!.completionTokensLimit ?? Infinity) ? 'red' : 'green'}>
                      Completion: {edge!.node!.completionTokens} / {edge!.node!.completionTokensLimit ? edge!.node!.completionTokensLimit : <>&infin;</>}
                    </Badge>
                  </div>}
                  {edge!.node!.status === 'REVOKED' && <div></div>}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {edge!.node!.resetFrequency == 'HOURLY' && 'Hourly'}
                  {edge!.node!.resetFrequency == 'DAILY' && 'Daily'}
                </TableCell>
                <TableCell className="flex gap-2 justify-end text-zinc-500">
                  {edge!.node!.status === 'ACTIVE' && <>
                    <Button color="light" onClick={() => resetLimit(edge!.node!.id)}>Reset Limits</Button>
                    <Button color="red" onClick={() => confirmRevoke(edge!.node!.id, edge!.node!.maskedKey)}>Revoke</Button>
                  </>}
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
              <Field>
                <Label>Name</Label>
                <Input {...register('name')} invalid={!!errors.name} />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
              </Field>
              <Field>
                <Label>Parent key</Label>
                <Select {...register('parentGatewayKeyId')} invalid={!!errors.parentGatewayKeyId}>
                  <option value=""></option>
                  {sortedGatewayKeys.map((key) => (
                    <option value={key!.node!.id} key={key!.node!.id}>{key!.node!.name}</option>
                  ))}
                </Select>
                {errors.parentGatewayKeyId && <ErrorMessage>{errors.parentGatewayKeyId.message}</ErrorMessage>}
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
              <Field>
                <Label>Prompt tokens limit</Label>
                <Input {...register('promptTokensLimit', { valueAsNumber: true })} type="number" invalid={!!errors.promptTokensLimit} />
                {errors.promptTokensLimit && <ErrorMessage>{errors.promptTokensLimit.message}</ErrorMessage>}
              </Field>
              <Field>
                <Label>Completion tokens limit</Label>
                <Input {...register('completionTokensLimit', { valueAsNumber: true })} type="number" invalid={!!errors.completionTokensLimit} />
                {errors.completionTokensLimit && <ErrorMessage>{errors.completionTokensLimit.message}</ErrorMessage>}
              </Field>
              <Field>
                <Label>Limit reset frequency</Label>
                <Select {...register('resetFrequency')} invalid={!!errors.resetFrequency}>
                  <option value=""></option>
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                </Select>
                {errors.resetFrequency && <ErrorMessage>{errors.resetFrequency.message}</ErrorMessage>}
              </Field>
            </div>
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
          Are you sure you want to immediately disable this key and all its nested keys?
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
          promptTokens
          completionTokens
          promptTokensLimit
          completionTokensLimit
          resetFrequency
          lastResetAt
          parent {
            id
            name
          }
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
