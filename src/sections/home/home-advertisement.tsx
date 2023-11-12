import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { bgGradient } from 'src/theme/css';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        pt: 5,
      }}
    >
      <Box
        component={m.div}
        variants={varFade().inDown}
        sx={{ color: 'common.white', mb: 3, typography: 'h2' }}
      >
        UTTC技術ブログ
        <br /> を始めよう
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={2}
        sx={{ pb: 3 }}
      >
        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            size="large"
            variant="contained"
            target="_blank"
            rel="noopener"
            href={PATH_AFTER_LOGIN} // ここを変える
            sx={{
              color: 'grey.800',
              bgcolor: 'common.white',
            }}
          >
            ログイン
          </Button>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            target="_blank"
            rel="noopener"
            href={PATH_AFTER_LOGIN}
            endIcon={<Iconify icon="eva:external-link-fill" width={16} sx={{ mr: 0.5 }} />}
            sx={{
              color: 'common.white',
              '&:hover': { borderColor: 'currentColor' },
            }}
          >
            新規登録
          </Button>
        </m.div>
      </Stack>
    </Box>
  );

  const renderImg = (
    <Stack component={m.div} variants={varFade().inUp} alignItems="center">
      <Box
        component={m.img}
        animate={{
          y: [-20, 0, -20],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        alt="rocket"
        src="/assets/images/home/lets.png"
        sx={{ maxWidth: 200, pt: 10, pb: 5, mr: { xs: 0, md: 5 } }}
      />
    </Stack>
  );

  return (
    <Container component={MotionViewport}>
      <Stack
        alignItems="center"
        justifyContent="center"
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.info.main,
            endColor: theme.palette.info.dark,
          }),
          borderRadius: 2,
          pb: { xs: 5, md: 5 },
        }}
      >
        {renderImg}

        {renderDescription}
      </Stack>
    </Container>
  );
}
