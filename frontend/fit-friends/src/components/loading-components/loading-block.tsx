import './loading-components.css';

export default function LoadingBlock(): JSX.Element {
  return (
    <div className="spinner-container__block" data-testid="loading-spinner-block">
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
