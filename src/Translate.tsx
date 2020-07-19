import React, {useEffect, useRef, useState} from "react"
import {Button, Card, CardContent, Grid, LinearProgress, Tooltip, Typography} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import {getAvailableEngines, getSupportedLanguages, SupportedLanguages, translate, TranslationResponse} from "./api";
import _ from "lodash";
import ISO6391 from 'iso-639-1';
import {makeStyles} from "@material-ui/core/styles";
import {AUTO, defaultLanguage, topLanguages} from "./constants";
import LanguageSelector from "./LanguageSelector";
import TranslateControls from "./TranslateControls";
import TranslationInput from "./TranslationInput";
import ErrorNotification from "./ErrorNotification";
import Alignment from "./Alignment";

function sortLanguages(a: string, b: string) {
    if (topLanguages.includes(a)) {
        if (topLanguages.includes(b)) {
            return topLanguages.indexOf(a) - topLanguages.indexOf(b)
        }
        return -1;
    }
    if (topLanguages.includes(b)) {
        return 1
    }
    return 0;
}

const useStyles = makeStyles({
    cardcontent: {
        "&:last-child": {
            paddingBottom: 16
        }
    },
    formgrouprow: {
        justifyContent: "space-around"
    }
});

function Translate() {
    const classes = useStyles();

    const textRef = useRef<null | HTMLInputElement>(null);

    const [fromLanguage, setFromLanguage] = useState<string>(AUTO);
    const [toLanguage, setToLanguage] = useState(defaultLanguage);
    const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguages>({});
    const [availableEngines, setAvailableEngines] = useState(["best"]);
    const [preferredEngine, setPreferredEngine] = useState<string>("best");
    const [useAlignment, setUseAlignment] = useState(false);
    const [useFallback, setUseFallback] = useState(true);
    const [latestTranslationResponse, setLatestTranslationResponse] = useState<TranslationResponse | null>(null);
    const [combinedToLanguages, setCombinedToLanguages] = useState<Set<string> | null>(null);
    const [languageDialogToShow, setLanguageDialogToShow] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hideAlignment, setHideAlignment] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);


    useEffect(()=> {
        setHideAlignment(true)
        setTimeout(()=> {
            setHideAlignment(false);
        }, 100);
    }, [latestTranslationResponse])


    useEffect(() => {
        getSupportedLanguages().then(supportedLangs => {
            setSupportedLanguages(supportedLangs)
            const toSetCombined = Object.values(supportedLangs).reduce((setOfLangCodes, langCodeList) => {
                langCodeList.forEach(lc => {
                    setOfLangCodes.add(lc)
                })
                return setOfLangCodes
            }, new Set<string>())
            setCombinedToLanguages(toSetCombined)
        });
        getAvailableEngines().then(engines => {
            setAvailableEngines(engines)
        })
    }, [])

    let toLanguageOptions: string[] = [];
    if (supportedLanguages) {
        if (fromLanguage !== AUTO) {
            toLanguageOptions = supportedLanguages[fromLanguage]
        }
        if (combinedToLanguages) {
            toLanguageOptions = Array.from(combinedToLanguages)
        }
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                    <TranslateControls classes={classes} useAlignment={useAlignment} setUseAlignment={setUseAlignment}
                                       useFallback={useFallback} setUseFallback={setUseFallback}
                                       preferredEngine={preferredEngine}
                                       setPreferredEngine={setPreferredEngine} availableEngines={availableEngines}/>
                </Grid>
                <Grid item xs={12} justify="space-between" container>
                    <Tooltip title="Language to translate from">
                        <Button
                            variant="contained"
                            startIcon={languageDialogToShow !== "from" ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                            onClick={() => setLanguageDialogToShow((prev) => prev !== "from" ? "from" : null)}
                        >
                            {fromLanguage !== AUTO ? (ISO6391.getName(fromLanguage) || fromLanguage) : "Auto Detect"}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Language to translate to">
                        <Button
                            variant="contained"
                            endIcon={languageDialogToShow !== "to" ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                            onClick={() => setLanguageDialogToShow(prev => prev !== "to" ? "to" : null)}
                        >
                            {ISO6391.getName(toLanguage) || toLanguage}
                        </Button>
                    </Tooltip>

                </Grid>
                {languageDialogToShow === "to" ? <Grid item xs={2}/> : null}
                <Grid item xs={10} justify="flex-end">
                    <LanguageSelector languageCodes={Object.keys(supportedLanguages).sort(sortLanguages)}
                                      selectedLanguage={fromLanguage ? fromLanguage : AUTO} onSelect={(value) => {
                        const newFromLanguage = String(value)
                        setFromLanguage(newFromLanguage)
                        if (supportedLanguages[newFromLanguage] && !supportedLanguages[newFromLanguage].includes(toLanguage)) {
                            if (supportedLanguages[newFromLanguage].includes(defaultLanguage) && defaultLanguage !== newFromLanguage) {
                                setToLanguage(defaultLanguage)
                            } else {
                                setToLanguage(supportedLanguages[newFromLanguage].find(v => v !== newFromLanguage) || defaultLanguage);
                            }
                        }
                    }} show={languageDialogToShow === "from"}/>
                    <LanguageSelector languageCodes={toLanguageOptions.sort(sortLanguages)}
                                      selectedLanguage={toLanguage}
                                      onSelect={(value) => {
                                          setToLanguage(String(value))
                                      }} show={languageDialogToShow === "to"}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card style={{height: "13em"}}>
                        <CardContent classes={{root: classes.cardcontent}}>
                            <TranslationInput ref={textRef}/>
                        </CardContent>

                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card style={{height: "13em"}}>
                        <CardContent classes={{root: classes.cardcontent}}>
                            <Typography
                                style={{minHeight: "9.3em"}}>{latestTranslationResponse?.translatedText}</Typography>
                            {latestTranslationResponse ?
                                <Typography align="right">
                                    Translation powered
                                    by {_.startCase(latestTranslationResponse.engine)} (version {latestTranslationResponse.engineVersion})
                                </Typography> : null
                            }
                        </CardContent>
                    </Card>
                </Grid>
                {latestTranslationResponse?.alignment && !hideAlignment ? (<React.Fragment>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Alignment alignment={latestTranslationResponse.alignment}
                                           sourceText={latestTranslationResponse.sourceText}
                                           translatedText={latestTranslationResponse.translatedText}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </React.Fragment>) : null}
                <Grid item xs={8} sm={10}>{loadingResponse ? <LinearProgress color="secondary" /> : null}</Grid>
                <Grid item xs={4} sm={2} style={{textAlign: "right"}}>
                    <Button size="large" onClick={() => {
                        setLoadingResponse(true);
                        translate({
                            sourceText: textRef.current ? textRef.current.value : "",
                            toLanguage,
                            ...(fromLanguage === AUTO ? {} : {fromLanguage}),
                            preferredEngine,
                            fallback: useFallback,
                            withAlignment: useAlignment
                        }).then(translationResponse => {
                            setLoadingResponse(false);
                            if (typeof translationResponse === "string") {
                                setErrorMessage(null);
                                setErrorMessage(translationResponse);
                            } else {
                                setLatestTranslationResponse(translationResponse)
                                setFromLanguage(translationResponse.fromLanguage)
                            }
                        })
                    }} variant="contained" color="secondary">Translate</Button>
                </Grid>
            </Grid>
            <ErrorNotification message={errorMessage}/>
        </React.Fragment>
    )
}


export default Translate;