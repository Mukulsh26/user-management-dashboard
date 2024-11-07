// src/pages/_app.js
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import store from '../redux/store';  // Ensure this path is correct
import '../styles/globals.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </SessionProvider>
    );
}
