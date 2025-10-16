import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Minimal inline components to satisfy routes without creating new files
const Home = () => <div>Home Page</div>;
const Upload = () => <div>Upload Page</div>;
const Purchase = () => <div>Purchase Page</div>;
const Contact = () => <div>Contact Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

export default function App() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/404" element={<NotFound />} />
        {/* Catch-all route to redirect to the 404 page */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}