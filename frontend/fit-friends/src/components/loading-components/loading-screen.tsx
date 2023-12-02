import './loading-components.css';

export default function LoadingScreen(): JSX.Element {
  return (
    <div className="spinner-container__screen">
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
