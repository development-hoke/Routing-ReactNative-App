import React from 'react';

// from app
import { WEB_ENDPOINT } from 'app/src/constants/Url';
import { SimpleWebView } from 'app/src/components/Content';

/** プライバシーポリシー画面 */
const PrivacyPolicyScreen: React.FC = () => {
  return <SimpleWebView uri={WEB_ENDPOINT.PRIVACY_POLICY} />;
};

export default PrivacyPolicyScreen;
