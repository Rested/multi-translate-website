import React from 'react';
import './App.css';
import {Typography, ThemeProvider, createMuiTheme} from "@material-ui/core";
import {purple} from "@material-ui/core/colors";
import logo from "./logo.svg"
import {Favorite} from "@material-ui/icons";
import logoTxt from "./logotxt.svg"
import Translate from "./Translate";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        // text: {
        //     primary: "#fff",
        //     secondary: "#000",
        // },
        // background: {
        //     paper: "#fbeabe"
        // },
        // getContrastText: background => "#2f3c7e"
    },
    typography: {
        fontFamily: `"Baloo 2", "Helvetica", "Arial", "sans-serif"`
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header>
                    <Typography color="textPrimary" variant="h2"
                                style={{display: "inline-block"}}>Multi-Translate</Typography>
                    <Typography color="textPrimary"
                               style={{display: "inline-block", marginLeft: "1rem", marginRight: "1rem"}}>made
                        with <Favorite fontSize="inherit"/> by</Typography>
                    <a href="https://rekon.uk">
                        <div style={{display: "inline-block"}}>
                            <img src={logo} style={{height: "2rem"}}/>
                            <img src={logoTxt} style={{height: "2rem", marginLeft: "0.75rem"}}/>
                        </div>
                    </a>
                </header>
                <section>
                    <Translate></Translate>
                </section>
            </div>
        </ThemeProvider>
    );
}

export default App;
