import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddGatewayKeyInput = {
  gatewayId: Scalars["ID"];
  name: Scalars["String"];
};

export type AddGatewayKeyPayload = {
  __typename?: "AddGatewayKeyPayload";
  gatewayKey?: Maybe<GatewayKey>;
  key?: Maybe<Scalars["String"]>;
};

export type AzureModelDeployment = {
  __typename?: "AzureModelDeployment";
  accountEndpoint: Scalars["String"];
  accountLocation: Scalars["String"];
  accountName: Scalars["String"];
  id: Scalars["ID"];
  modelDeploymentModelName: Scalars["String"];
  modelDeploymentModelVersion: Scalars["String"];
  modelDeploymentName: Scalars["String"];
  resourceGroupName: Scalars["String"];
  subscriptionId: Scalars["String"];
};

export type CreateGatewayInput = {
  name: Scalars["String"];
};

export type CreateGatewayPayload = {
  __typename?: "CreateGatewayPayload";
  gateway?: Maybe<Gateway>;
};

export type CreateInferenceEndpointInput = {
  deploymentName?: InputMaybe<Scalars["String"]>;
  endpoint: Scalars["String"];
  key?: InputMaybe<Scalars["String"]>;
  modelName?: InputMaybe<Scalars["String"]>;
  modelVersion?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  platform: Scalars["String"];
  region?: InputMaybe<Scalars["String"]>;
};

export type CreateInferenceEndpointPayload = {
  __typename?: "CreateInferenceEndpointPayload";
  inferenceEndpoint?: Maybe<InferenceEndpoint>;
};

export type Gateway = Node & {
  __typename?: "Gateway";
  createdAt: Scalars["String"];
  id: Scalars["ID"];
  inferenceEndpoints?: Maybe<GatewayInferenceEndpointConnection>;
  keys?: Maybe<GatewayKeyConnection>;
  name: Scalars["String"];
  status: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type GatewayinferenceEndpointsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type GatewaykeysArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type GatewayConnection = {
  __typename?: "GatewayConnection";
  edges?: Maybe<Array<Maybe<GatewayEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type GatewayEdge = {
  __typename?: "GatewayEdge";
  cursor: Scalars["String"];
  node?: Maybe<Gateway>;
};

export type GatewayInferenceEndpointConnection = {
  __typename?: "GatewayInferenceEndpointConnection";
  edges?: Maybe<Array<Maybe<GatewayInferenceEndpointEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type GatewayInferenceEndpointEdge = {
  __typename?: "GatewayInferenceEndpointEdge";
  cursor: Scalars["String"];
  node?: Maybe<InferenceEndpoint>;
  order: Scalars["Int"];
};

export type GatewayKey = Node & {
  __typename?: "GatewayKey";
  createdAt: Scalars["String"];
  id: Scalars["ID"];
  maskedKey: Scalars["String"];
  name: Scalars["String"];
  status: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type GatewayKeyConnection = {
  __typename?: "GatewayKeyConnection";
  edges?: Maybe<Array<Maybe<GatewayKeyEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type GatewayKeyEdge = {
  __typename?: "GatewayKeyEdge";
  cursor: Scalars["String"];
  node?: Maybe<GatewayKey>;
};

export type ImportAzureModelDeploymentInput = {
  inferenceEndpointName?: InputMaybe<Scalars["String"]>;
  modelDeploymentId: Scalars["String"];
};

export type ImportAzureModelDeploymentsInput = {
  modelDeployments: Array<ImportAzureModelDeploymentInput>;
};

export type ImportAzureModelDeploymentsPayload = {
  __typename?: "ImportAzureModelDeploymentsPayload";
  inferenceEndpoints: Array<InferenceEndpoint>;
};

export type InferenceEndpoint = Node & {
  __typename?: "InferenceEndpoint";
  createdAt: Scalars["String"];
  deploymentName?: Maybe<Scalars["String"]>;
  endpoint: Scalars["String"];
  id: Scalars["ID"];
  modelName?: Maybe<Scalars["String"]>;
  modelVersion?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  platform: Scalars["String"];
  region?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type InferenceEndpointConnection = {
  __typename?: "InferenceEndpointConnection";
  edges?: Maybe<Array<Maybe<InferenceEndpointEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type InferenceEndpointEdge = {
  __typename?: "InferenceEndpointEdge";
  cursor: Scalars["String"];
  node?: Maybe<InferenceEndpoint>;
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type LoginPayload = {
  __typename?: "LoginPayload";
  token?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  addGatewayKey?: Maybe<AddGatewayKeyPayload>;
  createGateway?: Maybe<CreateGatewayPayload>;
  createInferenceEndpoint?: Maybe<CreateInferenceEndpointPayload>;
  importAzureModelDeployments?: Maybe<ImportAzureModelDeploymentsPayload>;
  login?: Maybe<LoginPayload>;
  logout?: Maybe<Scalars["Boolean"]>;
  revokeGatewayKey?: Maybe<RevokeGatewayKeyPayload>;
  updateGateway?: Maybe<UpdateGatewayPayload>;
  updateInferenceEndpoint?: Maybe<UpdateInferenceEndpointPayload>;
};

export type MutationaddGatewayKeyArgs = {
  input: AddGatewayKeyInput;
};

export type MutationcreateGatewayArgs = {
  input: CreateGatewayInput;
};

export type MutationcreateInferenceEndpointArgs = {
  input: CreateInferenceEndpointInput;
};

export type MutationimportAzureModelDeploymentsArgs = {
  input: ImportAzureModelDeploymentsInput;
};

export type MutationloginArgs = {
  input: LoginInput;
};

export type MutationrevokeGatewayKeyArgs = {
  input: RevokeGatewayKeyInput;
};

export type MutationupdateGatewayArgs = {
  input: UpdateGatewayInput;
};

export type MutationupdateInferenceEndpointArgs = {
  input: UpdateInferenceEndpointInput;
};

export type Node = {
  id: Scalars["ID"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  azureModelDeployments: Array<AzureModelDeployment>;
  gateways?: Maybe<GatewayConnection>;
  inferenceEndpoints?: Maybe<InferenceEndpointConnection>;
  node?: Maybe<Node>;
  viewer?: Maybe<Viewer>;
};

export type QuerygatewaysArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryinferenceEndpointsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QuerynodeArgs = {
  id: Scalars["ID"];
};

export type RevokeGatewayKeyInput = {
  gatewayKeyId: Scalars["ID"];
};

export type RevokeGatewayKeyPayload = {
  __typename?: "RevokeGatewayKeyPayload";
  gatewayKey?: Maybe<GatewayKey>;
};

export type UpdateGatewayInput = {
  gatewayId: Scalars["ID"];
  inferenceEndpointIds: Array<Scalars["ID"]>;
  name: Scalars["String"];
};

export type UpdateGatewayPayload = {
  __typename?: "UpdateGatewayPayload";
  gateway?: Maybe<Gateway>;
};

export type UpdateInferenceEndpointInput = {
  deploymentName?: InputMaybe<Scalars["String"]>;
  endpoint?: InputMaybe<Scalars["String"]>;
  inferenceEndpointId: Scalars["ID"];
  key?: InputMaybe<Scalars["String"]>;
  modelName?: InputMaybe<Scalars["String"]>;
  modelVersion?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  platform: Scalars["String"];
  region?: InputMaybe<Scalars["String"]>;
};

export type UpdateInferenceEndpointPayload = {
  __typename?: "UpdateInferenceEndpointPayload";
  inferenceEndpoint?: Maybe<InferenceEndpoint>;
};

export type Viewer = {
  __typename?: "Viewer";
  email: Scalars["String"];
  id: Scalars["ID"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddGatewayKeyInput: AddGatewayKeyInput;
  AddGatewayKeyPayload: ResolverTypeWrapper<AddGatewayKeyPayload>;
  AzureModelDeployment: ResolverTypeWrapper<AzureModelDeployment>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  CreateGatewayInput: CreateGatewayInput;
  CreateGatewayPayload: ResolverTypeWrapper<CreateGatewayPayload>;
  CreateInferenceEndpointInput: CreateInferenceEndpointInput;
  CreateInferenceEndpointPayload: ResolverTypeWrapper<CreateInferenceEndpointPayload>;
  Gateway: ResolverTypeWrapper<Gateway>;
  GatewayConnection: ResolverTypeWrapper<GatewayConnection>;
  GatewayEdge: ResolverTypeWrapper<GatewayEdge>;
  GatewayInferenceEndpointConnection: ResolverTypeWrapper<GatewayInferenceEndpointConnection>;
  GatewayInferenceEndpointEdge: ResolverTypeWrapper<GatewayInferenceEndpointEdge>;
  GatewayKey: ResolverTypeWrapper<GatewayKey>;
  GatewayKeyConnection: ResolverTypeWrapper<GatewayKeyConnection>;
  GatewayKeyEdge: ResolverTypeWrapper<GatewayKeyEdge>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  ImportAzureModelDeploymentInput: ImportAzureModelDeploymentInput;
  ImportAzureModelDeploymentsInput: ImportAzureModelDeploymentsInput;
  ImportAzureModelDeploymentsPayload: ResolverTypeWrapper<ImportAzureModelDeploymentsPayload>;
  InferenceEndpoint: ResolverTypeWrapper<InferenceEndpoint>;
  InferenceEndpointConnection: ResolverTypeWrapper<InferenceEndpointConnection>;
  InferenceEndpointEdge: ResolverTypeWrapper<InferenceEndpointEdge>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  LoginInput: LoginInput;
  LoginPayload: ResolverTypeWrapper<LoginPayload>;
  Mutation: ResolverTypeWrapper<{}>;
  Node:
    | ResolversTypes["Gateway"]
    | ResolversTypes["GatewayKey"]
    | ResolversTypes["InferenceEndpoint"];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  RevokeGatewayKeyInput: RevokeGatewayKeyInput;
  RevokeGatewayKeyPayload: ResolverTypeWrapper<RevokeGatewayKeyPayload>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  UpdateGatewayInput: UpdateGatewayInput;
  UpdateGatewayPayload: ResolverTypeWrapper<UpdateGatewayPayload>;
  UpdateInferenceEndpointInput: UpdateInferenceEndpointInput;
  UpdateInferenceEndpointPayload: ResolverTypeWrapper<UpdateInferenceEndpointPayload>;
  Viewer: ResolverTypeWrapper<Viewer>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddGatewayKeyInput: AddGatewayKeyInput;
  AddGatewayKeyPayload: AddGatewayKeyPayload;
  AzureModelDeployment: AzureModelDeployment;
  Boolean: Scalars["Boolean"];
  CreateGatewayInput: CreateGatewayInput;
  CreateGatewayPayload: CreateGatewayPayload;
  CreateInferenceEndpointInput: CreateInferenceEndpointInput;
  CreateInferenceEndpointPayload: CreateInferenceEndpointPayload;
  Gateway: Gateway;
  GatewayConnection: GatewayConnection;
  GatewayEdge: GatewayEdge;
  GatewayInferenceEndpointConnection: GatewayInferenceEndpointConnection;
  GatewayInferenceEndpointEdge: GatewayInferenceEndpointEdge;
  GatewayKey: GatewayKey;
  GatewayKeyConnection: GatewayKeyConnection;
  GatewayKeyEdge: GatewayKeyEdge;
  ID: Scalars["ID"];
  ImportAzureModelDeploymentInput: ImportAzureModelDeploymentInput;
  ImportAzureModelDeploymentsInput: ImportAzureModelDeploymentsInput;
  ImportAzureModelDeploymentsPayload: ImportAzureModelDeploymentsPayload;
  InferenceEndpoint: InferenceEndpoint;
  InferenceEndpointConnection: InferenceEndpointConnection;
  InferenceEndpointEdge: InferenceEndpointEdge;
  Int: Scalars["Int"];
  LoginInput: LoginInput;
  LoginPayload: LoginPayload;
  Mutation: {};
  Node:
    | ResolversParentTypes["Gateway"]
    | ResolversParentTypes["GatewayKey"]
    | ResolversParentTypes["InferenceEndpoint"];
  PageInfo: PageInfo;
  Query: {};
  RevokeGatewayKeyInput: RevokeGatewayKeyInput;
  RevokeGatewayKeyPayload: RevokeGatewayKeyPayload;
  String: Scalars["String"];
  UpdateGatewayInput: UpdateGatewayInput;
  UpdateGatewayPayload: UpdateGatewayPayload;
  UpdateInferenceEndpointInput: UpdateInferenceEndpointInput;
  UpdateInferenceEndpointPayload: UpdateInferenceEndpointPayload;
  Viewer: Viewer;
};

export type AddGatewayKeyPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AddGatewayKeyPayload"] = ResolversParentTypes["AddGatewayKeyPayload"]
> = {
  gatewayKey?: Resolver<
    Maybe<ResolversTypes["GatewayKey"]>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AzureModelDeploymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AzureModelDeployment"] = ResolversParentTypes["AzureModelDeployment"]
> = {
  accountEndpoint?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  accountLocation?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  accountName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  modelDeploymentModelName?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  modelDeploymentModelVersion?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  modelDeploymentName?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  resourceGroupName?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  subscriptionId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateGatewayPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CreateGatewayPayload"] = ResolversParentTypes["CreateGatewayPayload"]
> = {
  gateway?: Resolver<Maybe<ResolversTypes["Gateway"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateInferenceEndpointPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CreateInferenceEndpointPayload"] = ResolversParentTypes["CreateInferenceEndpointPayload"]
> = {
  inferenceEndpoint?: Resolver<
    Maybe<ResolversTypes["InferenceEndpoint"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Gateway"] = ResolversParentTypes["Gateway"]
> = {
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  inferenceEndpoints?: Resolver<
    Maybe<ResolversTypes["GatewayInferenceEndpointConnection"]>,
    ParentType,
    ContextType,
    Partial<GatewayinferenceEndpointsArgs>
  >;
  keys?: Resolver<
    Maybe<ResolversTypes["GatewayKeyConnection"]>,
    ParentType,
    ContextType,
    Partial<GatewaykeysArgs>
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayConnection"] = ResolversParentTypes["GatewayConnection"]
> = {
  edges?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GatewayEdge"]>>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayEdge"] = ResolversParentTypes["GatewayEdge"]
> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes["Gateway"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayInferenceEndpointConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayInferenceEndpointConnection"] = ResolversParentTypes["GatewayInferenceEndpointConnection"]
> = {
  edges?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GatewayInferenceEndpointEdge"]>>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayInferenceEndpointEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayInferenceEndpointEdge"] = ResolversParentTypes["GatewayInferenceEndpointEdge"]
> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<
    Maybe<ResolversTypes["InferenceEndpoint"]>,
    ParentType,
    ContextType
  >;
  order?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayKeyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayKey"] = ResolversParentTypes["GatewayKey"]
> = {
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  maskedKey?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayKeyConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayKeyConnection"] = ResolversParentTypes["GatewayKeyConnection"]
> = {
  edges?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GatewayKeyEdge"]>>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GatewayKeyEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GatewayKeyEdge"] = ResolversParentTypes["GatewayKeyEdge"]
> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes["GatewayKey"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportAzureModelDeploymentsPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["ImportAzureModelDeploymentsPayload"] = ResolversParentTypes["ImportAzureModelDeploymentsPayload"]
> = {
  inferenceEndpoints?: Resolver<
    Array<ResolversTypes["InferenceEndpoint"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InferenceEndpointResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["InferenceEndpoint"] = ResolversParentTypes["InferenceEndpoint"]
> = {
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  deploymentName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  endpoint?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  modelName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  modelVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InferenceEndpointConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["InferenceEndpointConnection"] = ResolversParentTypes["InferenceEndpointConnection"]
> = {
  edges?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["InferenceEndpointEdge"]>>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InferenceEndpointEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["InferenceEndpointEdge"] = ResolversParentTypes["InferenceEndpointEdge"]
> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<
    Maybe<ResolversTypes["InferenceEndpoint"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["LoginPayload"] = ResolversParentTypes["LoginPayload"]
> = {
  token?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  addGatewayKey?: Resolver<
    Maybe<ResolversTypes["AddGatewayKeyPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationaddGatewayKeyArgs, "input">
  >;
  createGateway?: Resolver<
    Maybe<ResolversTypes["CreateGatewayPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateGatewayArgs, "input">
  >;
  createInferenceEndpoint?: Resolver<
    Maybe<ResolversTypes["CreateInferenceEndpointPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateInferenceEndpointArgs, "input">
  >;
  importAzureModelDeployments?: Resolver<
    Maybe<ResolversTypes["ImportAzureModelDeploymentsPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationimportAzureModelDeploymentsArgs, "input">
  >;
  login?: Resolver<
    Maybe<ResolversTypes["LoginPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationloginArgs, "input">
  >;
  logout?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  revokeGatewayKey?: Resolver<
    Maybe<ResolversTypes["RevokeGatewayKeyPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationrevokeGatewayKeyArgs, "input">
  >;
  updateGateway?: Resolver<
    Maybe<ResolversTypes["UpdateGatewayPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateGatewayArgs, "input">
  >;
  updateInferenceEndpoint?: Resolver<
    Maybe<ResolversTypes["UpdateInferenceEndpointPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateInferenceEndpointArgs, "input">
  >;
};

export type NodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Node"] = ResolversParentTypes["Node"]
> = {
  __resolveType: TypeResolveFn<
    "Gateway" | "GatewayKey" | "InferenceEndpoint",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PageInfo"] = ResolversParentTypes["PageInfo"]
> = {
  endCursor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  azureModelDeployments?: Resolver<
    Array<ResolversTypes["AzureModelDeployment"]>,
    ParentType,
    ContextType
  >;
  gateways?: Resolver<
    Maybe<ResolversTypes["GatewayConnection"]>,
    ParentType,
    ContextType,
    Partial<QuerygatewaysArgs>
  >;
  inferenceEndpoints?: Resolver<
    Maybe<ResolversTypes["InferenceEndpointConnection"]>,
    ParentType,
    ContextType,
    Partial<QueryinferenceEndpointsArgs>
  >;
  node?: Resolver<
    Maybe<ResolversTypes["Node"]>,
    ParentType,
    ContextType,
    RequireFields<QuerynodeArgs, "id">
  >;
  viewer?: Resolver<Maybe<ResolversTypes["Viewer"]>, ParentType, ContextType>;
};

export type RevokeGatewayKeyPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["RevokeGatewayKeyPayload"] = ResolversParentTypes["RevokeGatewayKeyPayload"]
> = {
  gatewayKey?: Resolver<
    Maybe<ResolversTypes["GatewayKey"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateGatewayPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UpdateGatewayPayload"] = ResolversParentTypes["UpdateGatewayPayload"]
> = {
  gateway?: Resolver<Maybe<ResolversTypes["Gateway"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateInferenceEndpointPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UpdateInferenceEndpointPayload"] = ResolversParentTypes["UpdateInferenceEndpointPayload"]
> = {
  inferenceEndpoint?: Resolver<
    Maybe<ResolversTypes["InferenceEndpoint"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Viewer"] = ResolversParentTypes["Viewer"]
> = {
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AddGatewayKeyPayload?: AddGatewayKeyPayloadResolvers<ContextType>;
  AzureModelDeployment?: AzureModelDeploymentResolvers<ContextType>;
  CreateGatewayPayload?: CreateGatewayPayloadResolvers<ContextType>;
  CreateInferenceEndpointPayload?: CreateInferenceEndpointPayloadResolvers<ContextType>;
  Gateway?: GatewayResolvers<ContextType>;
  GatewayConnection?: GatewayConnectionResolvers<ContextType>;
  GatewayEdge?: GatewayEdgeResolvers<ContextType>;
  GatewayInferenceEndpointConnection?: GatewayInferenceEndpointConnectionResolvers<ContextType>;
  GatewayInferenceEndpointEdge?: GatewayInferenceEndpointEdgeResolvers<ContextType>;
  GatewayKey?: GatewayKeyResolvers<ContextType>;
  GatewayKeyConnection?: GatewayKeyConnectionResolvers<ContextType>;
  GatewayKeyEdge?: GatewayKeyEdgeResolvers<ContextType>;
  ImportAzureModelDeploymentsPayload?: ImportAzureModelDeploymentsPayloadResolvers<ContextType>;
  InferenceEndpoint?: InferenceEndpointResolvers<ContextType>;
  InferenceEndpointConnection?: InferenceEndpointConnectionResolvers<ContextType>;
  InferenceEndpointEdge?: InferenceEndpointEdgeResolvers<ContextType>;
  LoginPayload?: LoginPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RevokeGatewayKeyPayload?: RevokeGatewayKeyPayloadResolvers<ContextType>;
  UpdateGatewayPayload?: UpdateGatewayPayloadResolvers<ContextType>;
  UpdateInferenceEndpointPayload?: UpdateInferenceEndpointPayloadResolvers<ContextType>;
  Viewer?: ViewerResolvers<ContextType>;
};
