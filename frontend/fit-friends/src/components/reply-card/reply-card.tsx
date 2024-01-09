import { Reply } from 'src/types/reply.type';

type ReplyCardProps = {
  card: Reply;
}

export default function ReplyCard({card: {text, rating, author}}: ReplyCardProps): JSX.Element {
  return (
    <li className="reviews-side-bar__item" data-testid="reply-card">
      <div className="review">
        <div className="review__user-info">
          <div className="review__user-photo">
            <picture>
              <img
                src={author.avatar}
                width="64" height="64"
                alt="Изображение пользователя"
              />
            </picture>
          </div>
          <span className="review__user-name">{author.name}</span>
          <div className="review__rating">
            <svg width="16" height="16" aria-hidden="true">
              <use xlinkHref="#icon-star"></use>
            </svg>
            <span>{rating}</span>
          </div>
        </div>
        <p className="review__comment">
          {text}
        </p>
      </div>
    </li>
  );
}
