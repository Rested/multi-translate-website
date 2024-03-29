import React, {useEffect, useState} from 'react';
import './App.css';
import {Typography, ThemeProvider, createMuiTheme, Tabs, Paper, Tab, Badge, Grid, Hidden} from "@material-ui/core";
import logo from "./logo.svg"
import {Favorite} from "@material-ui/icons";
import logoTxt from "./logotxt.svg"
import Translate from "./components/Translate";
import About from "./components/About";
import Support from "./components/Support";
import useHash from "./hooks/hash";
import {getVersion} from "./api";

const theme = createMuiTheme({
    palette: {
        text: {
            primary: "#2f3c7e",
            secondary: "#fff",
        },
        background: {
            paper: "#fff"
        },
        // getContrastText: background => "#2f3c7e"
    },
    typography: {
        fontFamily: `"Baloo 2", "Helvetica", "Arial", "sans-serif"`,
        h5: {
            margin: "0.7em 0"
        }
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: "1em",
            }
        }
    }
});

const hashes = ["#translate", "#about", "#support"];

function App() {
    const [tab, setTab] = useState(Math.max(0, hashes.indexOf(window.location.hash)));
    const [version, setVersion] = useState("0.6.0");
    const hash = useHash()
    useEffect(() => {
        setTab(Math.max(0, hashes.indexOf(hash)))
    }, [hash]);

    useEffect(() => {
        getVersion().then(v => setVersion(v));
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header>
                    <Grid container justify="space-between" alignItems="baseline">
                        <Grid item xs={12} sm={6}>
                            <Typography color="textSecondary" variant="h2"
                                        style={{display: "inline-block"}}>Multi-Translate</Typography>
                            <Hidden xsDown>
                                <Typography color="textSecondary" style={{
                                    display: "inline-block",
                                    marginLeft: "1rem"
                                }}> Version {version}</Typography>
                            </Hidden>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign: "right"}}>
                            <Typography color="textSecondary"
                                        style={{display: "inline-block", marginLeft: "1rem", marginRight: "1rem"}}>made
                                with <Favorite fontSize="inherit"/> by</Typography>
                            <a href="https://rekon.uk">
                                <div style={{display: "inline-block"}}>
                                    <img src={logo} style={{height: "2rem"}}/>
                                    <img src={logoTxt} style={{height: "2rem", marginLeft: "0.75rem"}}/>
                                </div>
                            </a>
                        </Grid>
                    </Grid>
                </header>
                <Paper style={{marginTop: 20, marginBottom: 40}}>
                    <Tabs centered onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
                        setTab(newValue);
                        window.location.hash = hashes[newValue];
                    }} value={tab}>
                        <Tab label="Translate"/>
                        <Tab label="About"/>
                        <Tab label="Support"/>
                    </Tabs>
                </Paper>
                <section style={tab !== 0 ? {display: "none"} : {}}>
                    <Translate/>
                </section>
                {tab === 1 ? <section><About/></section> : null}
                {tab === 2 ? <section><Support/></section> : null}
            </div>
        </ThemeProvider>
    );
}

export default App;
