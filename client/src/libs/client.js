import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';


// const errorLink = onError(({graphQLErrors, networkError}) => {
//   if(graphQLErrors){
//     graphqlErrors.map(({message, location, path}) => {
//       console.error(`Graphql Error: ${message}`)
//     })
//   }
//    if (networkError) {
//     console.error(`Network Error: ${networkError}`);
//   }
// })

// const link = from([
//   errorLink,
  
// ])

const client = new ApolloClient({
  link: new HttpLink({uri: "http://localhost:4000/graphql"}),
  cache: new InMemoryCache(),
});

export default client;
