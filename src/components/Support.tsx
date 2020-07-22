import React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";

export default function Support() {
    return <Card>
        <CardContent>
            <Typography variant="h5">
                Looking to use Multi-Translate in one of your applications or projects? We are here to help!
            </Typography>
            <Typography variant="h6">
                We offer
                <ul>
                    <li>Deployment support (getting Multi-Translate up and running on your network)</li>
                    <li>Integration support (hooking your app up to Multi-Translate)</li>
                    <li>Feature development (ensuring any additional features you need are built into Multi-Translate)</li>
                </ul>
            </Typography>
            <Typography variant="h6">
                Send us an email at <a href="mailto:enquire@rekon.uk">enquire@rekon.uk</a> to get started or
                {' '}find out more about us on our website <a href="https://rekon.uk">rekon.uk</a>
            </Typography>
        </CardContent>
    </Card>
}