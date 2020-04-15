export class RTC {
    localVideo;
    localStream;
    remoteVideo;
    peerConnection = {};
    serverConnection;
    myUUid;
    peerConnectionConfig = {
        'iceServers': [
            {'urls': 'stun:stun.stunprotocol.org:3478'},
            {'urls': 'stun:stun.l.google.com:19302'},
        ]
    };

    connectionMap = {};

    pageReady = () => {
        this.myUUid = this.createUUID();
        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remotes');
        console.log('page ready', this.localVideo, this.remoteVideo);
        var constraints = {
            video: true,
            audio: true,
        };

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(this.getUserMediaSuccess).catch(this.errorHandler);
        } else {
            alert('Your browser does not support getUserMedia API');
        }

        this.imHere();
        setInterval(this.imHere, 60000);
    }

    getUserMediaSuccess = (stream) => {
        console.log('getusermediasuccess', this);
        this.localStream = stream;
        this.localVideo.srcObject = stream;
    }

    imHere = () => {

        this.serverConnection.send(JSON.stringify({
            'type': 'ping',
            'from': this.myUUid
        }));
    }

    start = (isCaller, uuid, from) => {
        this.connectionMap[from] = uuid;
        console.log('Start uuid', uuid, 'from', from);
        this.peerConnection[uuid] = new RTCPeerConnection(this.peerConnectionConfig);
        this.peerConnection[uuid].onicecandidate = event => this.gotIceCandidate(event, uuid, from);
        this.peerConnection[uuid].oniceconnectionstatechange = event => this.connectionChanged(event, uuid, from);
        this.peerConnection[uuid].ontrack = event => this.gotRemoteStream(event, uuid, from);
        this.peerConnection[uuid].addStream(this.localStream);
        console.log(this.peerConnection);
        if (isCaller) {
            this.peerConnection[uuid].createOffer().then(desc => this.createdDescription(desc, uuid, from)).catch(this.errorHandler);
        }
    }

    connectionChanged = (event, uuid, from) => {
        const connection = this.peerConnection[uuid];

        if (connection.iceConnectionState === 'disconnected' || connection.iceConnectionState === 'failed') {
            delete this.peerConnection[uuid];
            document.getElementById(from).remove();
            console.log('remaining connections', this.peerConnection);
        }
    }

    gotMessageFromServer = (message) => {
        var signal = JSON.parse(message.data);
        if (signal.from === this.myUUid) return;

        if (signal.type === 'ping') {
            console.log(signal.from, 'is here');
            if (!this.connectionMap[signal.from]) {
                this.start(true, this.createUUID(), signal.from);
            }
        } else {
            if (signal.to === this.myUUid) {
                var uuid = signal.uuid;
                console.log('got message from server', signal);
                if (!this.peerConnection[uuid]) this.start(false, uuid, signal.from);

                // Ignore messages from ourself

                if (signal.sdp) {
                    this.peerConnection[uuid].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                        // Only create answers in response to offers
                        if (signal.sdp.type == 'offer') {
                            this.peerConnection[uuid].createAnswer().then(description => this.createdDescription(description, signal.uuid, signal.from)).catch(this.errorHandler);
                        }
                    }).catch(this.errorHandler);
                } else if (signal.ice) {
                    this.peerConnection[uuid].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
                }
            }
        }

    }

    gotIceCandidate = (event, uuid, from) => {
        if (event.candidate != null) {
            this.serverConnection.send(JSON.stringify({
                'ice': event.candidate,
                'uuid': uuid,
                'from': this.myUUid,
                'to': from
            }))
        }
    }

    createdDescription = (description, uuid, from) => {
        console.log('got description', uuid);

        this.peerConnection[uuid].setLocalDescription(description).then(() => {
            this.serverConnection.send(JSON.stringify({
                'sdp': this.peerConnection[uuid].localDescription,
                'uuid': uuid,
                'from': this.myUUid,
                'to': from
            }));
        }).catch(this.errorHandler);
    }

    gotRemoteStream = (event, uuid, from) => {
        console.log('got remote stream');

        var stream = event.streams[0];
        if (!document.getElementById(from)) {
            var video = document.createElement("video");
            video.setAttribute("autoplay", true);
            video.setAttribute("muted", true);
            video.setAttribute("id", from);
            this.remoteVideo.appendChild(video);
            video.srcObject = stream;

        }
    }

    function

    errorHandler(error) {
        console.log(error);
    }

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
    function

    createUUID = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

export const rtcService = new RTC();
