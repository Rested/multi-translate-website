import React, {Dispatch, SetStateAction} from 'react';
import {
    Card,
    CardContent,
    Divider,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Select,
    Switch, Tooltip,
    WithStyles
} from "@material-ui/core";
import _ from "lodash";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";

type TranslationControlsProps = {
    classes: ClassNameMap,
    useAlignment: boolean,
    setUseAlignment: Dispatch<SetStateAction<boolean>>,
    useFallback: boolean,
    setUseFallback: Dispatch<SetStateAction<boolean>>,
    preferredEngine: string,
    setPreferredEngine: Dispatch<SetStateAction<string>>
    availableEngines: string[]
}


export default function TranslateControls({classes, useAlignment, setUseAlignment, useFallback, setUseFallback, preferredEngine, setPreferredEngine, availableEngines}: TranslationControlsProps) {
    return <Card>
        <CardContent classes={{root: classes.cardcontent}}>
            <FormGroup row classes={{row: classes.formgrouprow}}>
                <Tooltip title="Retrieve word alignment information between the source and translated text">
                    <FormControlLabel
                        control={<Switch checked={useAlignment}
                                         onChange={({target: {checked}}) => setUseAlignment(checked)}/>}
                        label="With alignment info"
                        labelPlacement="start"
                    />
                </Tooltip>
                <Divider orientation="vertical" flexItem/>
                <Tooltip
                    title="Fall back to alternative engines when the request fails with the best or preferred engine">
                    <FormControlLabel
                        control={<Switch checked={useFallback}
                                         onChange={({target: {checked}}) => setUseFallback(checked)}/>}
                        label="Use fallback"
                        labelPlacement="start"
                    />
                </Tooltip>
                <Divider orientation="vertical" flexItem/>
                <FormControlLabel style={{marginLeft: -16}}
                                  control={<Select value={preferredEngine} style={{marginLeft: 16}}
                                                   variant="outlined"
                                                   onChange={({target: {value}}) => setPreferredEngine(String(value))}>
                                      <MenuItem value="best">Best</MenuItem>
                                      {availableEngines.map(engine => <MenuItem
                                          value={engine}>{_.startCase(engine)}</MenuItem>)}
                                  </Select>}
                                  labelPlacement="start"
                                  label="Preferred Engine"
                />
            </FormGroup>
        </CardContent>
    </Card>
}