import "../styles/PlotTypeChooser.css";
import React from 'react';
import ReactDOM from 'react-dom';
import {select} from 'd3-selection';
import {tracksInfo} from './config.js';

export class PlotTypeChooser extends React.Component {
    constructor(props) {
        super(props);

        this.datatypeToTrackType = {};

        tracksInfo
        .filter(x => x.orientation == this.props.orientation)
        .forEach(ti => {
            let datatypes = ti.datatype;

            if (!Array.isArray(ti.datatype))
                datatypes = [datatypes];

            datatypes.forEach(datatype => {
                if (!(datatype in this.datatypeToTrackType))
                    this.datatypeToTrackType[datatype] = [];
            

                this.datatypeToTrackType[datatype].push(ti)
            });
        });

        this.datatypeToTrackType['none'] = [];

        this.availableTrackTypes = this.datatypeToTrackType[this.props.datatype];

        this.state = {
            selectedPlotType: this.availableTrackTypes[0]
        }
    }

    componentWillReceiveProps(newProps) {
        this.availableTrackTypes = this.datatypeToTrackType[newProps.datatype];

        if (this.availableTrackTypes && this.availableTrackTypes.length > 0) {
            if (!this.availableTrackTypes.includes(this.state.selectedPlotType)) {
                this.handlePlotTypeSelected(this.availableTrackTypes[0]);
            }
        }
    }

    handlePlotTypeSelected(key) {
        this.setState({
            selectedPlotType: key
        });

        this.props.onPlotTypeSelected(key.type);
    }

    render() {
        let availableTrackTypesList = "No plot types available for track";
        let trackTypeToInfo = {};

        tracksInfo.forEach(ti => {
            trackTypeToInfo[ti.type] = ti;
        });

        if (this.availableTrackTypes) {
            availableTrackTypesList = this.availableTrackTypes
                .sort((a,b) => { return a.type < b.type})
                .map(x => {
                let thumbnail = trackTypeToInfo[x.type].thumbnail;
                let plotTypeClass = this.state.selectedPlotType.type == x.type ? 'plot-type-selected' : 'unselected'
                let imgTag = trackTypeToInfo[x.type].thumbnail ? 
                        <div style={{display: 'inline-block', marginRight: 10, verticalAlign: "middle"}} 
                            dangerouslySetInnerHTML={{__html: thumbnail.outerHTML}} /> :
                        <div style={{display: 'inline-block', marginRight: 10, verticalAlign: "middle"}} >
                            <svg width={30} height={20} />
                        </div>
                return (<li
                            style= {{listStyle: 'none', paddingLeft: 5, paddingBottom: 0}}
                            className={ plotTypeClass }
                            onClick={ 
                                (e) => {
                                    this.setState({selectedPlotType: x});
                                    this.props.onPlotTypeSelected(x.type);
                                }
                            }
                            >

                            {imgTag}
                            <span
                                style={{verticalAlign: "middle"}}
                            >
                            {x.type}</span>
                        </li>);
            });
        }

        return (<div>
                    { availableTrackTypesList }
                </div>)
    }
}
