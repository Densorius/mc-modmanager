import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { MantineProvider, MantineThemeOverride } from '@mantine/core'

import './styles/globals.scss';

import { Greet } from '../wailsjs/go/backend/App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const theme: MantineThemeOverride = {
    colorScheme: 'dark',
    colors: {
        'orange-primary': [
            "#FF0000",
            "#FF0000",
            "#FF0000",
            "#FF0000",
            "#EE8020",
            "#FF0000",
            "#FF0000",
            "#F2AA6B",
            "#EE8020",
            "#BB6419",
          ]
    },
    primaryColor: 'orange-primary',
}

Greet("Densorius").then(msg => console.log(msg));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <MantineProvider theme={theme} withGlobalStyles>
                <App />
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
);