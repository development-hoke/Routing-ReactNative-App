import React, { useState, useCallback } from 'react';
import {
  Container,
  Content,
  ListItem,
  Switch,
  Text,
  Left,
  Body,
  Right,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

/** リンク済みアカウント画面 */
const LinkedAccountScreen: React.FC = () => {
  const [facebookOn, setFacebookOn] = useState<boolean>(false);

  const handleSwitchFacebookValue = useCallback((value: boolean) => {
    setFacebookOn(value);
  }, []);

  return (
    <Container>
      <Content>
        <ListItem icon>
          <Left>
            <Ionicons
              name="logo-facebook"
              size={30}
              color={COLOR.facebookColor}
            />
          </Left>
          <Body>
            <Text style={appTextStyle.standardText}>Facebook</Text>
          </Body>
          <Right>
            <Switch
              onValueChange={handleSwitchFacebookValue}
              value={facebookOn}
            />
          </Right>
        </ListItem>
      </Content>
    </Container>
  );
};

export default LinkedAccountScreen;
