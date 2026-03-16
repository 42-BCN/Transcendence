import { baseGridStyles } from './base-grid.styles';

export function Grid8Overlay() {
  return <div aria-hidden="true" className={baseGridStyles.grid8pt} />;
}

export function Grid4Overlay() {
  return <div aria-hidden="true" className={baseGridStyles.grid4pt} />;
}

const columns = Array.from({ length: 12 });

export function Columns12Overlay() {
  return (
    <div aria-hidden="true" className={baseGridStyles.gridBase}>
      <div className={baseGridStyles.gridCols}>
        {columns.map((_, index) => (
          <div key={index} className={baseGridStyles.colsResponsive(index)} />
        ))}
      </div>
    </div>
  );
}
