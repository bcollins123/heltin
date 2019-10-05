/**
 *
 * LogoutPage
 *
 */

import React, { useEffect } from 'react';

// auth
import { setSession } from 'relay/client/session';

// ui
import { Flex } from '@domonda/ui/Flex';
import { Text } from '@domonda/ui/Text';

export type LogoutPageProps = {};

export const LogoutPage: React.FC<LogoutPageProps> = () => {
  useEffect(() => setSession(null), []);
  return (
    <Flex container justify="center" align="center">
      <Flex item>
        <Text color="primary" variant="title">
          Logging out...
        </Text>
      </Flex>
    </Flex>
  );
};

export const ComposedLogoutPage = LogoutPage;
