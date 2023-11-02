// export default Logo;
import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // 別の方法でロゴを表示するため、以下の行は不要ですので削除することができます。
    // const PRIMARY_LIGHT = theme.palette.primary.light;
    // const PRIMARY_MAIN = theme.palette.primary.main;
    // const PRIMARY_DARK = theme.palette.primary.dark;

    // ローカルのロゴイメージを参照するためにこの部分を使用します。
    const logo = (
      <Box
        component="img"
        src="/logo/uttc.svg" // => your path
        sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
        {...other}
        ref={ref}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
