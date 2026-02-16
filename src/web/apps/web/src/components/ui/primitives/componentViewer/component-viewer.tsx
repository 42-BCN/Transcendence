export function ComponentViewer({ title, children }) {
  return (
    <div className="border flex flex-col p-2 gap-1 bg-slate-50">
      <p className="text-xs">{title}</p>
      {children}
    </div>
  );
}
