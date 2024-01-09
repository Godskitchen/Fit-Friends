import './loading-components.css';

export default function LoadingScreen(): JSX.Element {
  return (
    <div className="spinner-container__screen" data-testid="loading-spinner-screen">
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
