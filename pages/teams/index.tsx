// /pages/teams/index.tsx

import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { TeamList } from '../../components/team/TeamList'
import { TEAMS_QUERY } from '../api/query/teams/teams-queries'

function TeamListPage() {
  const { data, loading, error, fetchMore } = useQuery(TEAMS_QUERY, {
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  //const { endCursor, hasNextPage } = data.teams.pageInfo;

  return (
    <div>
      <Head>
        <title>Teams</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TeamList teams={data?.teams} />
    </div>
  )
}

export default TeamListPage
