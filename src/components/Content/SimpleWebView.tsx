import React from 'react';
import { WebView } from 'react-native-webview';

// from app
import { LoadingSpinner } from 'app/src/components/Spinners';

interface Props {
  uri: string;
}

/** WebView */
export const SimpleWebView: React.FC<Props> = (props: Props) => {
  const { uri } = props;

  const renderLoadingSpinner = (): JSX.Element => LoadingSpinner;

  return (
    <WebView
      source={{ uri }}
      style={{ marginTop: 20 }}
      renderLoading={renderLoadingSpinner}
      startInLoadingState
    />
  );
};
