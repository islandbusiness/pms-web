import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
    typography: {
        h4: {
            fontWeight: 'bold'
        }
    }
});
theme = responsiveFontSizes(theme);

const Main = ({ children }) => {

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}


export default Main;