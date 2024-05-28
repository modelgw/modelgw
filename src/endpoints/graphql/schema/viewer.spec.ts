import { createMockDefaultContext } from '@/mocks/graphql-server';
import { GraphQLResponse } from '@apollo/server';
import assert from 'assert';
import gql from 'graphql-tag';
import { graphqlServer } from '../graphql-server';
import { ServerContext, User } from '../server-context';
import { encodeGlobalId } from '../utils';
import { Query, Viewer } from './generated/types';


const MOCK_USER: User = {
	id: 'MOCK_ID',
	email: 'MOCK_EMAIL',
	name: 'MOCK_NAME',
	lastName: 'MOCK_LAST_NAME',
};

const MOCK_QUERY_VIEWER = gql`
	query ViewerQuery {
		viewer {
			id
			email
		}
	}
`;

const MOCK_CONTEXT: ServerContext = createMockDefaultContext();

const EXPECTED_RESULT_VIEWER: Viewer = {
	id: encodeGlobalId('MOCK_ID', 'User'),
	email: 'MOCK_EMAIL',
};


describe('viewerResolvers', () => {
	describe('when called without valid user', () => {
		let response: GraphQLResponse<Query>;
		beforeAll(async () => {
			response = await graphqlServer.executeOperation<Query>({ query: MOCK_QUERY_VIEWER }, { contextValue: MOCK_CONTEXT });
		});
		it('returns no viewer and unauthorized error result', async () => {
			expectSingleErrorResponse(
				response,
				{ viewer: null },
				{
					message: 'Unauthorized',
					path: ['viewer'],
					extensions: { code: 'UNAUTHORIZED' },
				}
			);
		});
	});

	describe('when called with valid user', () => {
		let response: GraphQLResponse<Query>;
		beforeAll(async () => {
			response = await graphqlServer.executeOperation<Query>({ query: MOCK_QUERY_VIEWER }, {
				contextValue: {
					...MOCK_CONTEXT,
					user: MOCK_USER,
				}
			});
		});
		it('returns expected result', async () => {
			expect(response.body.kind).toEqual('single');
			assert(response.body.kind === 'single');
			expect(response.body.singleResult.errors).toBeUndefined();
			expect(response.body.singleResult.data).toEqual({
				viewer: EXPECTED_RESULT_VIEWER,
			});
		});
	});
});

function expectSingleErrorResponse(
	response: GraphQLResponse,
	expectedDataObject: Record<string, unknown> | null,
	errorMatchObject: Record<string, unknown>
) {
	expect(response.body.kind).toEqual('single');
	assert(response.body.kind === 'single');
	expect(response.body.singleResult.data).toEqual(expectedDataObject);
	expect(response.body.singleResult.errors).toBeInstanceOf(Array);
	expect(response.body.singleResult.errors).toHaveLength(1);
	assert(Array.isArray(response.body.singleResult.errors));
	expect(response.body.singleResult.errors[0]).toMatchObject(errorMatchObject);
}
