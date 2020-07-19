import React, {useState, useEffect} from 'react';
import {Alert, AlertTitle} from '@material-ui/lab'
import _ from 'lodash';
import {Snackbar} from "@material-ui/core";

type ErrorNotificationProps = {
    message: string | null
}

export default function ErrorNotification({message}: ErrorNotificationProps) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if(message) setOpen(true);
    }, [message])

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {message ? _.upperFirst(message) : null}
            </Alert>
        </Snackbar>
    )
}