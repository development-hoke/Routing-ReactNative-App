import React from 'react';

// from app
import { WEB_ENDPOINT } from 'app/src/constants/Url';
import { SimpleWebView } from 'app/src/components/Content';

/** 運営主体について画面 */
const AboutScreen: React.FC = () => {
  return <SimpleWebView uri={WEB_ENDPOINT.ABOUT} />;
};

export default AboutScreen;
