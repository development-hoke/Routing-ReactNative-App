import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, ListItem, Text } from 'native-base';

// from app
import { COLOR } from 'app/src/constants';
import { IInformation } from 'app/src/interfaces/api/Notification';

interface Props {
  notification: IInformation;
}

/** 運営からのお知らせリスト要素 */
export const InformationElement: React.FC<Props> = (props: Props) => {
  const { notification } = props;

  return (
    <ListItem avatar style={thisStyle.container}>
      <Body>
        <Text style={thisStyle.titleText}>{notification.title}</Text>
        <Text note style={thisStyle.dateText}>
          {notification.notification_date.substr(0, 10)}
        </Text>
      </Body>
    </ListItem>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'genju-medium',
    textDecorationColor: COLOR.inactiveColor,
    textDecorationLine: 'underline',
  },
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 10,
  },
});
