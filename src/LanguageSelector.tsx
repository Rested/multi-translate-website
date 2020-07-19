import React from "react";
import {Button, Card, Grid} from "@material-ui/core";
import ISO6391 from 'iso-639-1';
import {AUTO, AUTO_NAME} from "./constants";

type LanguageSelectorOptions = {
    languageCodes: string[],
    selectedLanguage: string,
    onSelect: (languageCode: string) => void,
    show: boolean
}

export default function LanguageSelector({languageCodes, selectedLanguage, onSelect, show = false}: LanguageSelectorOptions) {
    function onClick(event: React.SyntheticEvent<EventTarget>) {
        console.log('got click', event.target)
        if (event.target instanceof HTMLSpanElement && event.target.parentNode instanceof HTMLButtonElement){
            onSelect(event.target.parentNode.dataset.code || selectedLanguage)
        }
        if(!(event.target instanceof HTMLButtonElement)){
            return
        }
        onSelect(event.target.dataset.code || selectedLanguage)
    }

    return <Grid container alignItems="center" justify="flex-start" spacing={1} style={show ? {
        overflowY: "scroll",
        overflowX: "hidden",
        height: "29em"
    } : {display: "none"}}>
        <Grid item xs={2}>
            <Button variant="contained" onClick={() => {
                onSelect(AUTO)
            }} style={{minHeight: "5em"}} color={selectedLanguage === AUTO ? "secondary" : "primary"}
                    fullWidth>{AUTO_NAME}</Button>
        </Grid>
        {languageCodes.map(languageCode => {
            return <Grid item xs={2} alignItems="center" alignContent="center" key={languageCode}>
                <Button variant="contained"
                        fullWidth
                        style={{minHeight: "5em"}}
                        onClick={onClick}
                        data-code={languageCode}
                        color={selectedLanguage === languageCode ? "secondary" : "primary"}>{ISO6391.getName(languageCode) || languageCode}</Button></Grid>
        })}

    </Grid>
}