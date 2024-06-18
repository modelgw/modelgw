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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AddGatewayKeyInput = {
  gatewayId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type AddGatewayKeyPayload = {
  __typename?: "AddGatewayKeyPayload";
  gatewayKey?: Maybe<GatewayKey>;
  key?: Maybe<Scalars["String"]["output"]>;
};

export type AzureModelDeployment = {
  __typename?: "AzureModelDeployment";
  accountEndpoint: Scalars["String"]["output"];
  accountLocation: Scalars["String"]["output"];
  accountName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  modelDeploymentModelName: Scalars["String"]["output"];
  modelDeploymentModelVersion: Scalars["String"]["output"];
  modelDeploymentName: Scalars["String"]["output"];
  resourceGroupName: Scalars["String"]["output"];
  subscriptionId: Scalars["String"]["output"];
};

export type CreateGatewayInput = {
  name: Scalars["String"]["input"];
};

export type CreateGatewayPayload = {
  __typename?: "CreateGatewayPayload";
  gateway?: Maybe<Gateway>;
};

export type CreateInferenceEndpointInput = {
  deploymentName?: InputMaybe<Scalars["String"]["input"]>;
  endpoint: Scalars["String"]["input"];
  key?: InputMaybe<Scalars["String"]["input"]>;
  modelName?: InputMaybe<Scalars["String"]["input"]>;
  modelVersion?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  platform: Scalars["String"]["input"];
  region?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateInferenceEndpointPayload = {
  __typename?: "CreateInferenceEndpointPayload";
  inferenceEndpoint?: Maybe<InferenceEndpoint>;
};

export type Gateway = Node & {
  __typename?: "Gateway";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  inferenceEndpoints?: Maybe<GatewayInferenceEndpointConnection>;
  keys?: Maybe<GatewayKeyConnection>;
  logPayload: Scalars["Boolean"]["output"];
  logTraffic: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type GatewayinferenceEndpointsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GatewaykeysArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GatewayConnection = {
  __typename?: "GatewayConnection";
  edges?: Maybe<Array<Maybe<GatewayEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GatewayEdge = {
  __typename?: "GatewayEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Gateway>;
};

export type GatewayInferenceEndpointConnection = {
  __typename?: "GatewayInferenceEndpointConnection";
  edges?: Maybe<Array<Maybe<GatewayInferenceEndpointEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GatewayInferenceEndpointEdge = {
  __typename?: "GatewayInferenceEndpointEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<InferenceEndpoint>;
  order: Scalars["Int"]["output"];
};

export type GatewayKey = Node & {
  __typename?: "GatewayKey";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  maskedKey: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type GatewayKeyConnection = {
  __typename?: "GatewayKeyConnection";
  edges?: Maybe<Array<Maybe<GatewayKeyEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GatewayKeyEdge = {
  __typename?: "GatewayKeyEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GatewayKey>;
};

export type ImportAzureModelDeploymentInput = {
  inferenceEndpointName?: InputMaybe<Scalars["String"]["input"]>;
  modelDeploymentId: Scalars["String"]["input"];
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
  createdAt: Scalars["String"]["output"];
  deploymentName?: Maybe<Scalars["String"]["output"]>;
  endpoint: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  modelName?: Maybe<Scalars["String"]["output"]>;
  modelVersion?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  platform: Scalars["String"]["output"];
  region?: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type InferenceEndpointConnection = {
  __typename?: "InferenceEndpointConnection";
  edges?: Maybe<Array<Maybe<InferenceEndpointEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type InferenceEndpointEdge = {
  __typename?: "InferenceEndpointEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<InferenceEndpoint>;
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type LoginPayload = {
  __typename?: "LoginPayload";
  token?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]["output"]>;
  addGatewayKey?: Maybe<AddGatewayKeyPayload>;
  createGateway?: Maybe<CreateGatewayPayload>;
  createInferenceEndpoint?: Maybe<CreateInferenceEndpointPayload>;
  importAzureModelDeployments?: Maybe<ImportAzureModelDeploymentsPayload>;
  login?: Maybe<LoginPayload>;
  logout?: Maybe<Scalars["Boolean"]["output"]>;
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
  id: Scalars["ID"]["output"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
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
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryinferenceEndpointsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QuerynodeArgs = {
  id: Scalars["ID"]["input"];
};

export type RevokeGatewayKeyInput = {
  gatewayKeyId: Scalars["ID"]["input"];
};

export type RevokeGatewayKeyPayload = {
  __typename?: "RevokeGatewayKeyPayload";
  gatewayKey?: Maybe<GatewayKey>;
};

export type UpdateGatewayInput = {
  gatewayId: Scalars["ID"]["input"];
  inferenceEndpointIds: Array<Scalars["ID"]["input"]>;
  logPayload: Scalars["Boolean"]["input"];
  logTraffic: Scalars["Boolean"]["input"];
  name: Scalars["String"]["input"];
};

export type UpdateGatewayPayload = {
  __typename?: "UpdateGatewayPayload";
  gateway?: Maybe<Gateway>;
};

export type UpdateInferenceEndpointInput = {
  deploymentName?: InputMaybe<Scalars["String"]["input"]>;
  endpoint?: InputMaybe<Scalars["String"]["input"]>;
  inferenceEndpointId: Scalars["ID"]["input"];
  key?: InputMaybe<Scalars["String"]["input"]>;
  modelName?: InputMaybe<Scalars["String"]["input"]>;
  modelVersion?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  platform: Scalars["String"]["input"];
  region?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateInferenceEndpointPayload = {
  __typename?: "UpdateInferenceEndpointPayload";
  inferenceEndpoint?: Maybe<InferenceEndpoint>;
};

export type Viewer = {
  __typename?: "Viewer";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
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

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> =
  {
    Node: Gateway | GatewayKey | InferenceEndpoint;
  };

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddGatewayKeyInput: AddGatewayKeyInput;
  AddGatewayKeyPayload: ResolverTypeWrapper<AddGatewayKeyPayload>;
  AzureModelDeployment: ResolverTypeWrapper<AzureModelDeployment>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
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
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  ImportAzureModelDeploymentInput: ImportAzureModelDeploymentInput;
  ImportAzureModelDeploymentsInput: ImportAzureModelDeploymentsInput;
  ImportAzureModelDeploymentsPayload: ResolverTypeWrapper<ImportAzureModelDeploymentsPayload>;
  InferenceEndpoint: ResolverTypeWrapper<InferenceEndpoint>;
  InferenceEndpointConnection: ResolverTypeWrapper<InferenceEndpointConnection>;
  InferenceEndpointEdge: ResolverTypeWrapper<InferenceEndpointEdge>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginInput: LoginInput;
  LoginPayload: ResolverTypeWrapper<LoginPayload>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["Node"]>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  RevokeGatewayKeyInput: RevokeGatewayKeyInput;
  RevokeGatewayKeyPayload: ResolverTypeWrapper<RevokeGatewayKeyPayload>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
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
  Boolean: Scalars["Boolean"]["output"];
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
  ID: Scalars["ID"]["output"];
  ImportAzureModelDeploymentInput: ImportAzureModelDeploymentInput;
  ImportAzureModelDeploymentsInput: ImportAzureModelDeploymentsInput;
  ImportAzureModelDeploymentsPayload: ImportAzureModelDeploymentsPayload;
  InferenceEndpoint: InferenceEndpoint;
  InferenceEndpointConnection: InferenceEndpointConnection;
  InferenceEndpointEdge: InferenceEndpointEdge;
  Int: Scalars["Int"]["output"];
  LoginInput: LoginInput;
  LoginPayload: LoginPayload;
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>["Node"];
  PageInfo: PageInfo;
  Query: {};
  RevokeGatewayKeyInput: RevokeGatewayKeyInput;
  RevokeGatewayKeyPayload: RevokeGatewayKeyPayload;
  String: Scalars["String"]["output"];
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
  logPayload?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  logTraffic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
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
