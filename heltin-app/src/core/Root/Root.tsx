/**
 *
 * Root
 *
 */

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createLazy } from 'lib/lazy';
import { RestoreScroll } from 'lib/RestoreScroll';
import { Helmet } from 'react-helmet';

// relay
import { graphql, useLocalQuery } from 'relay/hooks';
import { environment } from 'relay/environment';
import { checkIsAuthorized } from 'relay/client/session';
import { RootSessionQuery } from 'relay/artifacts/RootSessionQuery.graphql';

// ui
import { Flex } from '@domonda/ui/Flex';

// pages
import { LOGIN_PAGE_ROUTE, LOGOUT_PAGE_ROUTE, DEFAULT_ROUTE, CLIENTS_PAGE_ROUTE } from 'lib/routes';
const LazyFourOhFourPage = createLazy(() => import('../pages/FourOhFourPage/default'));
const LazyLoginPage = createLazy(() => import('../pages/LoginPage/default'));
const LazyLogoutPage = createLazy(() => import('../pages/LogoutPage/default'));
const LazyClientsPage = createLazy(() => import('../pages/ClientsPage/default'));

// parts
import { AppBar } from '../AppBar';

// decorate
import { decorate, Decorate } from './decorate';

// eslint-disable-next-line react/display-name
const RootRoutes = React.memo<{ isAuthorized: boolean }>(function RootRoutes(props) {
  const { isAuthorized } = props;
  if (!isAuthorized) {
    return (
      <Switch>
        <Route path={LOGIN_PAGE_ROUTE} component={LazyLoginPage} />
        <Redirect path="*" to={LOGIN_PAGE_ROUTE} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path={LOGOUT_PAGE_ROUTE} component={LazyLogoutPage} />
      <Route path={CLIENTS_PAGE_ROUTE} component={LazyClientsPage} />
      <Redirect exact path="/" to={DEFAULT_ROUTE} />
      <Route path="*" component={LazyFourOhFourPage} />
    </Switch>
  );
});

const Root: React.FC<Decorate> = (props) => {
  const { classes } = props;

  const { session } = useLocalQuery<RootSessionQuery>({
    environment,
    query: graphql`
      query RootSessionQuery {
        __typename
        session {
          token
          expiresAt
        }
      }
    `,
    variables: {},
  });

  const isAuthorized = (session && checkIsAuthorized(session)) || false;

  return (
    <>
      <Helmet titleTemplate="%s | heltin" />
      <Flex container direction="column">
        {isAuthorized && (
          <Flex item container align="stretch" className={classes.header} component="header">
            <AppBar />
          </Flex>
        )}
        <RestoreScroll>
          {(ref) => (
            <Flex ref={ref} item container flex={1} className={classes.content} component="main">
              <Switch>
                {/* Removes trailing slashes */}
                <Route
                  path="/:url*(/+)"
                  exact
                  strict
                  render={({ location }) => <Redirect to={location.pathname.replace(/\/+$/, '')} />}
                />
                <RootRoutes isAuthorized={isAuthorized} />
              </Switch>
            </Flex>
          )}
        </RestoreScroll>
      </Flex>
    </>
  );
};

const StyledRoot = decorate(Root);
export { StyledRoot as Root };
