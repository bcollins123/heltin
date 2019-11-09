/**
 *
 * FourOhFourPage
 *
 */

import React from 'react';

// ui
import { Flex, FlexProps } from '@domonda/ui/Flex';
import { Text } from '@domonda/ui/Text';

export const FourOhFourPage: React.FC<FlexProps> = () => (
  <Flex container align="center" justify="center">
    <Flex item style={{ textAlign: 'center' }}>
      <Text size="medium" weight="medium">
        Oh no!
      </Text>
      <Text color="gray30">Requested page not found</Text>
    </Flex>
  </Flex>
);
