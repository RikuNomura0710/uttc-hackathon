import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: '野村 理玖',
    class: '4',
    faculty: '工学部',
    department: 'システム創成学科',
    grade: 'B4',
    can: 'React',
    did: 'チームリーダー経験あり',
    will: 'AIプロジェクト、スタートアップ企業での勤務に興味あり',
    photoURL: _mock.image.avatar(24), // これは適切なURLに置き換える必要があります
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
