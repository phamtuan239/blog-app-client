import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  HttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const access_token = localStorage.getItem("access_token");

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    operation.setContext(
      ({ headers }) => ({
      headers: {
        authorization: access_token,
        ...headers,
      },
    })
    );
    return forward(operation);
  }),
  new HttpLink({ uri: process.env.REACT_APP_HTTP_LINK_URL }),
]);

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WEB_SOCKET_LINK_URL,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const AppoloProvider = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default AppoloProvider;
