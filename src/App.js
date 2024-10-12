import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [modelLoaded, setModelLoaded] = useState(false);
  const [color, setColor] = useState("#00FFFF"); // Initial color

  // Main function to run object detection
  const runCoco = async () => {
    const net = await cocossd.load();
    setModelLoaded(true);

    // Function to detect objects
    const detect = async () => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const obj = await net.detect(video);

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        drawRect(obj, ctx, color); // Pass color to the drawing utility
      }
      requestAnimationFrame(detect);
    };

    detect();
  };

  // Change color every second
  useEffect(() => {
    const colorInterval = setInterval(() => {
      const newColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random color
      setColor(newColor);
    }, 1000); // Change color every second

    return () => clearInterval(colorInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        {modelLoaded ? (
          <p>Model Loaded! Detecting objects...</p>
        ) : (
          <p>Loading model...</p>
        )}
      </header>
    </div>
  );
}

export default App;
