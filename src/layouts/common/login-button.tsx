import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export function LoginButton({ sx }: Props) {
  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="outlined" sx={{ mr: 1, ...sx }}>
      ログイン
    </Button>
  );
}

export function ContainLoginButton({ sx }: Props) {
  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="contained" sx={{ ...sx }}>
      ログイン
    </Button>
  );
}

export function ContainSignUpButton({ sx }: Props) {
  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="contained" sx={{ ...sx }}>
      新規登録
    </Button>
  );
}
