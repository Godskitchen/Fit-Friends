import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import Header from 'src/components/header/header';
import { HeaderNavTab } from 'src/types/constants';

export default function NotFoundPage(): JSX.Element {

  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <Header activeTab={HeaderNavTab.Home} />
      <main>
        <div
          className="container"
          style={{
            minHeight: '800px',
            display: 'flex',
            alignItems: 'center',
            flexDirection:'column',
            justifyContent: 'center'
          }}
        >
          <h1 style={{margin: '0 auto'}}>Запрашиваемая страница не найдена</h1>
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

