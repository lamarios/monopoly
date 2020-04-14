import React from 'react';
import {rtcService} from "./services/webrtc";

export default class Video extends React.Component {
    componentDidMount() {
        rtcService.pageReady();
    }

    render() {
        return (<div className="video-chat">
            <h1>Video</h1>
            <button onClick={rtcService.imHere}>Join video Chat</button>
            <div className={"video-container remotes"} id={"remotes"}>
                <video id="localVideo" autoPlay muted></video>
            </div>
        </div>)
    }
}