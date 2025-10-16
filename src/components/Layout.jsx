import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  // TODO: Implement main app layout (header, sidebar, etc.)
  return (
    <main><Outlet /></main>
  );
}