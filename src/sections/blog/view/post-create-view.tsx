'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PostNewEditForm from '../post-new-edit-form';

// ----------------------------------------------------------------------

export default function PostCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="投稿作成"
        links={[
          {
            name: 'UTTC',
            href: paths.dashboard.root,
          },
          {
            name: 'コンテンツ',
            href: paths.dashboard.post.root,
          },
          {
            name: '作成',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PostNewEditForm />
    </Container>
  );
}
