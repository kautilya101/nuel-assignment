import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App';
import client from './libs/client';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
