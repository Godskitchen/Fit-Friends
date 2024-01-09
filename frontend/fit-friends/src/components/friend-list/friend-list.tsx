import { UserInfo } from 'src/types/user.type';
import FriendCard from '../friend-card/friend-card';
import { Role } from 'src/types/constants';

type FriendListProps = {
  friendCards: UserInfo[];
  myReadyStatus: boolean;
  myRole: Role;
}

export default function FriendList({friendCards, myReadyStatus, myRole}: FriendListProps): JSX.Element {
  return (
    <ul className="friends-list__list">
      {friendCards.map((card) => (
        <FriendCard
          card={card}
          myReadyStatus={myReadyStatus}
          myRole={myRole}
          key={card.userId}
        />
      ))}
    </ul>
  );
}
