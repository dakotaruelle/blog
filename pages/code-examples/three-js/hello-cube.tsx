import Paper from '@mui/material/Paper';
import React, { useEffect } from 'react';
import sdk from '@stackblitz/sdk';

export default function HelloCubePage() {
  useEffect(() => {
    sdk.embedProjectId('stackblitz-embed', 'three-js-hello-cube', {
      forceEmbedLayout: true,
      openFile: 'index.ts',
      view: 'preview',
      theme: 'dark',
      hideExplorer: true,
      hideNavigation: true,
      hideDevTools: true,
    });
  }, []);

  return (
    <>
      <div className="stackblitz-container">
        <div id="stackblitz-embed"></div>
      </div>
    </>
  );
}
