import React from 'react';

// from app
import { WEB_ENDPOINT } from 'app/src/constants/Url';
import { SimpleWebView } from 'app/src/components/Content';

/** 特定商法取引画面 */
const SCCScreen: React.FC = () => {
  return <SimpleWebView uri={WEB_ENDPOINT.SCC} />;
};

export default SCCScreen;
