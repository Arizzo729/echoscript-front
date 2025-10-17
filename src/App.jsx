import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>EchoScript</h1>
      <p>Welcome  basic shell is live.</p>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/purchase">Purchase</Link>
      </nav>
    </div>
  );
}
function Upload() { return <div style={{ padding: 24 }}><h2>Upload</h2><p>Coming soon.</p></div>; }
function Purchase() { return <div style={{ padding: 24 }}><h2>Purchase</h2><p>Coming soon.</p></div>; }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}