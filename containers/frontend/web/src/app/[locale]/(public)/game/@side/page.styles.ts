export const gameSidePageStyles = {
  // Use fixed positioning on mobile for the game chat toggle so it appears above overlays
  toggleButton:
    'fixed right-4 top-16 z-[9999] pointer-events-auto md:top-4 md:absolute md:right-4 md:z-[200]',
  // Keep chat wrapper above game UI; high z-index to avoid stacking context issues
  chatWrapper: 'ml-auto h-full w-full max-w-sm md:max-w-none relative z-[9998]',
};
