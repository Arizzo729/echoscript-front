import React, {useRef, useState, useState} from "react";
import useSimpleRecorder from "../hooks/useSimpleRecorder.jsx";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const { recording, permissionError, start, stop } = useSimpleRecorder();

  const onPick = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const onStartRec = async () => { await start(); };
  const onStopRec  = async () => {
    const f = await stop();
    if (f) setFile(f);
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Upload</h1>

      <div style={{ marginTop: 12 }}>
        <label>
          <span style={{ marginRight: 8 }}>Choose file:</span>
          <input type="file" onChange={onPick} />
        </label>
      </div>

      {permissionError && (
        <p style={{ color: "crimson", marginTop: 8 }}>{permissionError}</p>
      )}

      <div style={{ marginTop: 12 }}>
        {!recording ? (
          <button onClick={onStartRec}>Start recording</button>
        ) : (
          <button onClick={onStopRec}>Stop recording</button>
        )}
      </div>

      {file && (
        <p style={{ marginTop: 12 }}>
          Selected: <strong>{file.name}</strong>{" "}
          {typeof file.size === "number" ? `(${Math.round(file.size / 1024)} kB)` : ""}
        </p>
      )}
    </div>
  );
}
