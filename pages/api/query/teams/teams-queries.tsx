// /pages/api/query/teams/teams-queries.tsx
import { gql } from '@apollo/client'

export const TEAMS_QUERY = gql`
  query teamsQuery($first: Int, $after: String, $id: String) {
    teams(first: $first, after: $after, id: $id) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          managerId
          members {
            id
            name
          }
        }
      }
    }
  }
`

export const TEAMS_CREATE_MUTATION = gql`
  mutation createTeam($name: String!, $managerId: String!) {
    createTeam(name: $name, managerId: $managerId) {
      name
      managerId
    }
  }
`

export const TEAMS_UPDATE_MUTATION = gql`
  mutation updateTeam(
    $id: String!,
    $name: String!,
    $managerId: String!,
  ) {
    updateTeam(id: $id, name: $name, managerId: $managerId) {
      name
      managerId
    }
  }
`

export const TEAMS_DELETE_MUTATION = gql`
  mutation deleteTeam($id: String!) {
    deleteTeam(id: $id) {
      id
    }
  }
`
