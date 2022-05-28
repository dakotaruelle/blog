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
        <h1>Three JS - Hello Cube</h1>
        <p>The hello world of Three JS, a basic scene with a simple cube</p>
        <p>
          This cube uses a{' '}
          <a href="https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry">
            BoxGeomerty
          </a>{' '}
          with a{' '}
          <a href="https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial">
            MeshBasicMaterial
          </a>
          . It utilizes a{' '}
          <a href="https://threejs.org/docs/index.html?q=pers#api/en/cameras/PerspectiveCamera">
            PerspectiveCamera
          </a>
          ,{' '}
          <a href="https://threejs.org/docs/index.html?q=orbit#examples/en/controls/OrbitControls">
            OrbitControls
          </a>{' '}
          for interactivity, and resizes when the window changes.
        </p>
        <div id="stackblitz-embed"></div>
      </div>
    </>
  );
}
