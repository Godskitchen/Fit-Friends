import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

export default function ForbiddenPage(): JSX.Element {

  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <main>
        <div
          className="container"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection:'column',
            justifyContent: 'center'
          }}
        >
          <h1 style={{margin: '0 auto'}}>Данная страница для вас недоступна</h1>
          <div style={{width: '256px', marginTop: '50px'}}>
            <button
              className="btn"
              type="button"
              onClick={() => navigate(AppRoute.Main)}
            >
              На главную
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
