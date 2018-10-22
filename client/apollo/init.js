import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'

let apolloClient = null

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    uri: '/api',
    link: new HttpLink({
      uri: 'http://localhost:4000/api'
    }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo(initialState) {
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
