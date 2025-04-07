import React, { useState } from "react";
import "./App.css";
function App() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [listening, setListening] = useState(false);
  const ESP_IP = "http://192.168.161.2"; // Replace with your ESP IP

  const handleVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
  
    setListening(true);
  
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      handleCommand(spokenText.toLowerCase());
      setListening(false);
    };
  
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    
    recognition.start();
  };

  const handleCommand = (command) => {
    let location = "";

    if (command.includes("si lab")) location = "si-lab";
    else if (command.includes("jenetics lab")) location = "jenetics-lab";
    else if (command.includes("robotics lab")) location = "robotics-lab";
    else if (command.includes("classroom")) location = "classroom";

    if (location) {
      sendToESP(location);
    } else {
      setStatus("❌ Command not recognized. Try again.");
    }
  };

  const sendToESP = async (location) => {
    try {
      const response = await fetch(`${ESP_IP}/command?location=${location}`);
      const result = await response.text();
      setStatus(`✅ Sent command: ${location}`);
    } catch (error) {
      setStatus("⚠️ Failed to reach ESP8266. Check connection.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎤 Hey Kiya - Voice Navigator</h1>

      <button
        style={{
          ...styles.button,
          ...(listening ? styles.buttonActive : {}),
        }}
        onClick={handleVoice}
      >
        {listening ? "Listening..." : "Speak Now"}
      </button>

      <div style={styles.output}>
        <h3>🗣 Recognized Text:</h3>
        <p>{text || "Nothing yet..."}</p>
      </div>

      <div style={styles.status}>
        <h3>📤 Status:</h3>
        <p>{status || "No command sent yet."}</p>
      </div>

      <div style={styles.commands}>
        <h3>🧠 Supported Commands:</h3>
        <ul>
          <li>Hey Kiya, take me to the SI Lab</li>
          <li>Hey Kiya, take me to the Jenetics Lab</li>
          <li>Hey Kiya, take me to the Robotics Lab</li>
          <li>Hey Kiya, take me to the Classroom</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  button: {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "all 0.3s ease",
  },

  buttonActive: {
    animation: "pulse 1s infinite",
    backgroundColor: "#5c6bc0",
  },
  output: {
    backgroundColor: "#f0f0f0",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  status: {
    padding: "10px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  commands: {
    textAlign: "left",
    backgroundColor: "#fff3e0",
    padding: "15px",
    borderRadius: "8px",
  },
};

export default App;
