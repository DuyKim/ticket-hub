import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css';

import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap');
  }, []);

  return (
    <div>
      <header>Header</header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer />
    </div>
  );
}
