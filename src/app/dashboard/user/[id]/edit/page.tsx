import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

type Props = {
  params: {
    id: string;
  };
};

// export default function UserEditPage({ params }: Props) {
//   const { id } = params;

//   return <UserEditView id={id} />;
// }

export default function UserEditPage() {
  const id = 'dummy-id';

  return <UserEditView id={id} />;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
export async function generateStaticParams() {
  // ダミーデータを作成
  const dummyUserList = [
    { id: 'dummy-id-1' },
    { id: 'dummy-id-2' },
    // ...他のダミーユーザー
  ];

  return dummyUserList.map((user) => ({
    id: user.id,
  }));
}
