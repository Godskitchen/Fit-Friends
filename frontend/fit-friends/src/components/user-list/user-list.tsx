import { UserInfo } from 'src/types/user.type';
import UserCard from '../user-card/user-card';
import { Specialisation } from 'src/types/constants';

type UserListProps = {
  userCards: UserInfo[];
}
export default function UserList({userCards}: UserListProps): JSX.Element {

  let cardId = 0;
  return (
    <ul className="users-catalog__list">
      {
        userCards.map((card) => (
          <UserCard
            key={cardId++}
            userId={card.userId}
            name={card.name}
            avatar={card.avatar}
            location={card.location}
            role={card.role}
            specialisations={
              (
                card.trainerProfile?.specialisations ??
                card.userProfile?.specialisations
              ) as Specialisation[]
            }
          />
        ))
      }
    </ul>
  );
}
