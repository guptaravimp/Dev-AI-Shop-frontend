const useVoiceRecognition = (onTranscript) => {
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Transcript:", transcript);
      onTranscript(transcript);
    };

    document.getElementById("start-btn").onclick = () => recognition.start();
  }, [onTranscript]);
};
