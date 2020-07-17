import React, {useState, useEffect} from "react"
import {
    Card,
    CardContent,
    TextField,
    Grid,
    Typography,
    Select,
    MenuItem,
    Button,
    FormGroup,
    FormControlLabel, Switch
} from "@material-ui/core";
import {getAvailableEngines, getSupportedLanguages, SupportedLanguages, translate, TranslationResponse} from "./api";
import _ from "lodash";
import ISO6391 from 'iso-639-1';

const defaultLanguage = window.navigator.language.split("-")[0];

const MAX_LENGTH = 140;
const AUTO: string = "auto"

// by number of speakers (+ korean)
const topLanguages = ["zh", "es", "en", "hi", "ar", "bn", "pt", "ru", "ko", "ja"];

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

function Translate() {
    const [fromLanguage, setFromLanguage] = useState<string>(AUTO);
    const [toLanguage, setToLanguage] = useState(defaultLanguage);
    const [sourceText, setSourceText] = useState("");
    const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguages>({});
    const [availableEngines, setAvailableEngines] = useState(["best"]);
    const [preferredEngine, setPreferredEngine] = useState<string>("best");
    const [useAlignment, setUseAlignment] = useState(false);
    const [useFallback, setUseFallback] = useState(true);
    const [latestTranslationResponse, setLatestTranslationResponse] = useState<TranslationResponse | null>(null)
    const [combinedToLanguages, setCombinedToLanguages] = useState<Set<string> | null>(null);


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
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Switch checked={useAlignment}
                                                 onChange={({target: {checked}}) => setUseAlignment(checked)}/>}
                                label="With alignment info"
                            />
                            <FormControlLabel
                                control={<Switch checked={useFallback}
                                                 onChange={({target: {checked}}) => setUseFallback(checked)}/>}
                                label="Use fallback"
                            />
                            <FormControlLabel
                                control={<Select value={preferredEngine}
                                                 onChange={({target: {value}}) => setPreferredEngine(String(value))}>
                                    <MenuItem value="best">Best</MenuItem>
                                    {availableEngines.map(engine => <MenuItem
                                        value={engine}>{_.startCase(engine)}</MenuItem>)}
                                </Select>}
                                label="Preferred Engine"
                            />
                        </FormGroup>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card>
                    <CardContent>
                        <Select value={fromLanguage ? fromLanguage : AUTO} onChange={({target: {value}}) => {
                            const newFromLanguage = String(value)
                            setFromLanguage(newFromLanguage)
                            if (supportedLanguages[newFromLanguage] && !supportedLanguages[newFromLanguage].includes(toLanguage)) {
                                if (supportedLanguages[newFromLanguage].includes(defaultLanguage) && defaultLanguage !== newFromLanguage) {
                                    setToLanguage(defaultLanguage)
                                } else {
                                    setToLanguage(supportedLanguages[newFromLanguage].find(v => v !== newFromLanguage) || defaultLanguage);
                                }
                            }
                        }}>
                            <MenuItem value={AUTO}>Auto Detect</MenuItem>
                            {Object.keys(supportedLanguages).sort(sortLanguages).map(langCode => <MenuItem
                                key={`from-${langCode}`}
                                value={langCode}>{ISO6391.getName(langCode) || langCode}</MenuItem>)}
                        </Select>
                        <TextField
                            value={sourceText}
                            onChange={({target: {value}}) => {
                                if (value.length <= MAX_LENGTH) {
                                    setSourceText(value)
                                }
                            }}
                            multiline rows={4} placeholder="Something to translate" color="secondary"/>
                        <Typography>{sourceText.length}/{MAX_LENGTH}</Typography>
                    </CardContent>

                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card>
                    <CardContent>

                        <Select value={toLanguage} onChange={({target: {value}}) => {
                            setToLanguage(String(value))
                        }}>
                            {toLanguageOptions.sort(sortLanguages).map(toLangCode =>
                                <MenuItem key={`to-${toLangCode}`}
                                          value={toLangCode}>{ISO6391.getName(toLangCode) || toLangCode}</MenuItem>)}
                        </Select>
                        <Typography>{latestTranslationResponse?.translatedText}</Typography>
                        {latestTranslationResponse ?
                            <Typography>
                                Translation powered
                                by {_.startCase(latestTranslationResponse.engine)} (version {latestTranslationResponse.engineVersion})
                            </Typography> : null
                        }
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={() => {
                    translate({
                        sourceText,
                        toLanguage,
                        ...(fromLanguage === AUTO ? {} : {fromLanguage}),
                        preferredEngine,
                        fallback: useFallback,
                        withAlignment: useAlignment
                    }).then(translationResponse => {
                        setLatestTranslationResponse(translationResponse)
                        setFromLanguage(translationResponse.fromLanguage)
                    })
                }}>Translate</Button>
            </Grid>
        </Grid>
    )
}


export default Translate;