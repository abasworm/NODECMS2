function initVideo(){
    const videoElement          = document.querySelector('#videos');
    const videoSelect           = document.querySelector('select#videoSource');
    const captureVideoButton    = document.querySelector('#btncapt');
    const screenshotButton      = document.querySelector('#btnscr');
    const resetButton           = document.querySelector('#btnrst');

    const img                   = document.querySelector('#imgs');

    const canvas                = document.createElement('canvas');


    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices).then(getStream).catch(handleError);

    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || 'camera ' +
                    (videoSelect.length + 1);
                videoSelect.appendChild(option);
            } else {
                console.log('Found another kind of device: ', deviceInfo);
            }
        }
    }

    function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
        track.stop();
        });
    }

    const constraints = {
        video: {
            deviceId: {exact: videoSelect.value}
        }
    };

    captureVideoButton.onclick = function() {
        navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
        }
    }

    resetButton.onclick = function(){
        img.src = "";
        videoElement.style.display='block';
    }

    screenshotButton.onclick =  function() {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, 640, 480);
        // Other browsers will fall back to image/png
        img.src = canvas.toDataURL('image/webp');
        videoElement.style.display='none';
    };

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;
    }

    function handleError(error) {
        console.error('Error: ', error);
    }
}