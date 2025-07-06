// src/components/Layout.jsx (final version)
        {!showIntro &&
          (isMobile ? (
            // Mobile: ONLY MobileLayout, AudioOverlay handled INSIDE MobileLayout if you want mobile overlay.
            <MobileLayout>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
              {/* REMOVE <AudioOverlay /> from here! */}
            </MobileLayout>
          ) : (
            // Desktop: render only ONCE here for desktop only
            <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white">
              <Suspense fallback={<div className="h-16 w-full bg-zinc-900" />}>
                <Header
                  onToggleDrawer={toggleDrawer}
                  drawerOpen={drawerOpen}
                  collapseSidebar={collapseSidebar}
                  sidebarCollapsed={sidebarCollapsed}
                />
              </Suspense>

              <div className="flex flex-1 overflow-hidden">
                <Suspense fallback={<div className="w-20 bg-zinc-900" />}>
                  <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                  />
                </Suspense>

                <main
                  id="main-content"
                  className={`flex-1 overflow-y-auto relative px-6 py-4 transition-all duration-300 ${
                    sidebarCollapsed ? 'pl-20' : 'pl-56'
                  }`}
                  tabIndex={0}
                  role="main"
                  aria-label="Main content"
                >
                  {isPending && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ loop: Infinity, duration: 1 }}
                        className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full"
                        aria-label="Loading"
                        role="status"
                      />
                    </div>
                  )}

                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </main>
              </div>

              <ToastContainer position="top-right" />

              {/* Desktop overlay: render only ONCE here */}
              <AudioOverlay />
            </div>
          ))}


