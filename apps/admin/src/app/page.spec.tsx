import { Button } from '@/components/ui/Button';
import { HomePageQuery, HomePageQueryVariables } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from './page';


const HOME_PAGE_QUERY = gql`
  query HomePage {
    gateways {
      totalCount
    }
    inferenceEndpoints {
      totalCount
    }
    viewer {
      ...Layout_viewer
    }
  }
  fragment Layout_viewer on Viewer {
    id
    email
  }
`;

const mockUnauthorized: MockedResponse<HomePageQuery, HomePageQueryVariables> = {
  request: {
    query: HOME_PAGE_QUERY,
  },
  result: {
    "errors": [
      {
        "message": "Unauthorized",
        "path": [
          "gateways"
        ],
        "extensions": {
          "code": "UNAUTHORIZED"
        }
      },
      {
        "message": "Unauthorized",
        "path": [
          "inferenceEndpoints"
        ],
        "extensions": {
          "code": "UNAUTHORIZED"
        }
      },
      {
        "message": "Unauthorized",
        "path": [
          "viewer"
        ],
        "extensions": {
          "code": "UNAUTHORIZED"
        }
      }
    ],
    "data": {
      "gateways": null,
      "inferenceEndpoints": null,
      "viewer": null
    }
  }
};


const mockAuthorized: MockedResponse<HomePageQuery, HomePageQueryVariables> =
{
  request: {
    query: HOME_PAGE_QUERY,
  },
  result: {
    data: {
      "gateways": {
        "totalCount": 2
      },
      "inferenceEndpoints": {
        "totalCount": 2
      },
      "viewer": {
        "id": "QURNSU46VXNlcg",
        "email": "igor.urmincek@gmail.com"
      }
    }
  }
}

describe('Page', () => {

  it('should render button', async () => {
    render(<Button>Hello</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Hello');
  });

  it('should render successfully if user authorized', async () => {
    render(<div id="cau">
      <MockedProvider mocks={[mockAuthorized]} addTypename={false}>
        <Page />
      </MockedProvider>
      <Button>Hello</Button>
    </div>
    );

    // expect(await screen.findByRole('button')).toHaveTextContent('Hello');
  });
});