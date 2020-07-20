import React, {useRef, useEffect} from 'react';
import {AlignmentMap} from "../api";
import {Container, Grid, Typography} from "@material-ui/core";
import {ArcherContainer, ArcherElement} from 'react-archer';

type AlignmentProps = {
    alignment: AlignmentMap[],
    sourceText: string
    translatedText: string
}



export default function Alignment({alignment, sourceText, translatedText}: AlignmentProps) {
    let sourceFarthestIndex = 0;
    let destFarthestIndex = 0;
    const destFromArrows: string[] = [];

    return (
        <ArcherContainer noCurves={false} strokeColor="#2f3c7e">
            <Grid spacing={4}>
                <Grid item xs={12} container direction="row" style={{whiteSpace: "nowrap"}}>
                    {alignment.sort((a, b) => Number(a.src.start) - Number(b.src.start)).map((alignmentMap, currentIndex) => {
                        const hasBeenAdded = alignment.find((x, i) =>
                            alignmentMap.src.start === x.src.start && alignmentMap.src.end === x.src.end && i < currentIndex);
                        if (hasBeenAdded) return null
                        const matchingAlignSections = alignment.filter((x, i) => alignmentMap.src.start === x.src.start && alignmentMap.src.end === x.src.end)
                        if (matchingAlignSections.length > 1){
                            matchingAlignSections.forEach(s => destFromArrows.push(`srcF${s.src.start}T${s.src.end}destF${s.dest.start}T${s.dest.end}`))
                        }
                        const preText = sourceText.substring(sourceFarthestIndex, Number(alignmentMap.src.start))
                        sourceFarthestIndex = Number(alignmentMap.src.end) + 1;
                        return <React.Fragment key={`${sourceText}${translatedText}${alignmentMap.src.text}`}>
                            {preText.length ? <div style={{
                                paddingTop: 10,
                                paddingBottom: 0,
                            }}>{preText === " " ? <span>&nbsp;</span> : preText.replace(/ /g, "\u00a0")}</div> : null}
                            <ArcherElement id={`srcF${alignmentMap.src.start}T${alignmentMap.src.end}`}
                                           relations={matchingAlignSections.length === 1 ? [{
                                               targetId: `destF${alignmentMap.dest.start}T${alignmentMap.dest.end}`,
                                               targetAnchor: 'top',
                                               sourceAnchor: 'bottom',
                                               style: {
                                                   arrowThickness: 3
                                               }
                                           }] : []}


                            >
                                <div
                                    id={`srcF${alignmentMap.src.start}T${alignmentMap.src.end}`}
                                    style={{
                                        textDecorationLine: "underline",
                                        paddingTop: 10,
                                        paddingBottom: 0,
                                    }}>{sourceText.substring(Number(alignmentMap.src.start), Number(alignmentMap.src.end) + 1).replace(/ /g, "\u00a0")}</div>
                            </ArcherElement>
                        </React.Fragment>
                    })}
                    <div style={{
                        paddingTop: 10,
                        paddingBottom: 0,
                    }}>{sourceText.substring(sourceFarthestIndex, sourceText.length).replace(/ /g, "\u00a0")}</div>
                </Grid>
                <Grid item xs={12} container direction="row" style={{marginTop: 90, whiteSpace: "nowrap"}}>
                    {alignment.sort((a, b) => Number(a.dest.start) - Number(b.dest.start)).map((alignmentMap, currentIndex) => {
                        const hasBeenAdded = alignment.find((x, i) =>
                            alignmentMap.dest.start === x.dest.start && alignmentMap.dest.end === x.dest.end && i !== currentIndex);
                        if (hasBeenAdded) return null

                        const preText = translatedText.substring(destFarthestIndex, Number(alignmentMap.dest.start))
                        destFarthestIndex = Number(alignmentMap.dest.end) + 1;
                        return <React.Fragment key={`${sourceText}${translatedText}${alignmentMap.dest.text}`}>
                            {preText.length ? <div style={{
                                paddingTop: 0,
                                paddingBottom: 10,
                            }}>{preText === " " ? <span>&nbsp;</span> : preText.replace(/ /g, "\u00a0")}</div> : null}
                            <ArcherElement id={`destF${alignmentMap.dest.start}T${alignmentMap.dest.end}`} relations={
                                destFromArrows.includes(`srcF${alignmentMap.src.start}T${alignmentMap.src.end}destF${alignmentMap.dest.start}T${alignmentMap.dest.end}`) ? [{
                                targetId: `srcF${alignmentMap.src.start}T${alignmentMap.src.end}`,
                                targetAnchor: 'bottom',
                                sourceAnchor: 'top',
                                style: {
                                    arrowThickness: 3
                                }
                            }] : []}>
                                <div
                                    id={`destF${alignmentMap.dest.start}T${alignmentMap.dest.end}`}
                                    style={{
                                        textDecorationLine: "overline",
                                        paddingTop: 0,
                                        paddingBottom: 10,
                                    }}>{translatedText.substring(Number(alignmentMap.dest.start), Number(alignmentMap.dest.end) + 1).replace(/ /g, "\u00a0")}</div>
                            </ArcherElement>
                        </React.Fragment>
                    })}
                    <div style={{
                        paddingTop: 10,
                        paddingBottom: 0,
                    }}>{translatedText.substring(destFarthestIndex, translatedText.length).replace(/ /g, "\u00a0")}</div>
                </Grid>
            </Grid>
        </ArcherContainer>
    )
}