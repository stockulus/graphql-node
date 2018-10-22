import App, { Container } from 'next/app'
import { ApolloProvider } from 'react-apollo'

import withApollo from '../apollo/with_client'

export default withApollo(
  class extends App {
    render() {
      const { Component, pageProps, apolloClient } = this.props

      return (
        <Container>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Container>
      )
    }
  }
)
