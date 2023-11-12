'use client';

import { useContext } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetUser } from 'src/api/user';
import { AuthContext } from 'src/auth/context/firebase/auth-context';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const { user } = useContext(AuthContext);

  const { user: currentUserProfile } = useGetUser(user?.uid); // ここのエラーが怖い
  // console.log(currentUserProfile);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="アカウント情報"
        links={[
          { name: 'コンテンツ', href: paths.dashboard.post.root },
          { name: 'アカウント情報' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <AccountGeneral currentProfile={currentUserProfile} />
    </Container>
  );
}
