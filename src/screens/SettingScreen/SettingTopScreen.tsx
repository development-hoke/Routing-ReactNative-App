import React from 'react';
import { Container, Content, List, ListItem, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// from app
import { appTextStyle } from 'app/src/styles';

/** 設定画面トップ */
const SettingTopScreen: React.FC = () => {
  const { navigate } = useNavigation();

  /**
   * リンクを描画する
   * @param name リンク表示名(設定名)
   * @param navigateKey 画面遷移のキー名
   * @return ListItem
   */
  const renderLink = (name: string, navigateKey: string): JSX.Element => {
    const handleNavigate = () => {
      navigate(navigateKey);
    };

    return (
      <ListItem onPress={handleNavigate}>
        <Text style={appTextStyle.standardText}>{name}</Text>
      </ListItem>
    );
  };

  return (
    <Container>
      <Content>
        <List>
          <ListItem itemDivider>
            <Text style={appTextStyle.defaultText}>アカウント</Text>
          </ListItem>
          {renderLink('プロフィール設定', 'Profile')}
          {/**
          {renderLink('リンク済みアカウント', 'Account')}
          */}
          {renderLink('パスワード変更', 'Pass')}
          {renderLink('ログアウト', 'Logout')}
          <ListItem itemDivider>
            <Text style={appTextStyle.defaultText}>その他</Text>
          </ListItem>
          {renderLink('ヘルプセンター', 'Faq')}
          {renderLink('利用規約', 'Terms')}
          {renderLink('プライバシーポリシー', 'Privacy')}
          {renderLink('特定商取引法', 'SCC')}
          {renderLink('検索履歴の削除', 'History')}
        </List>
      </Content>
    </Container>
  );
};

export default SettingTopScreen;
