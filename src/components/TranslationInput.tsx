import React, {MutableRefObject, RefObject, useState} from 'react';
import {CardContent, TextField, Typography} from "@material-ui/core";
import {MAX_LENGTH} from "../constants";

function TranslationInput(props: any, ref: any) {
    const [sourceText, setSourceText] = useState("");

    return (<React.Fragment>
        <TextField
            inputRef={ref}
            value={sourceText}
            fullWidth
            onChange={({target: {value}}) => {
                if (value.length <= MAX_LENGTH) {
                    setSourceText(value)
                }
            }}
            multiline rows={6} placeholder="Something to translate" color="secondary"/>
        <Typography align="right" style={{marginTop: 10}}>Characters
            used {sourceText.length}/{MAX_LENGTH}</Typography>
    </React.Fragment>);
}

export default React.forwardRef(TranslationInput);