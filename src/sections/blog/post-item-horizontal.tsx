import { useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { HOST_API } from 'src/config-global';
import { AuthContext } from 'src/auth/context/firebase/auth-context';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

type Props = {
  post: IPostItem;
};

export default function PostItemHorizontal({ post }: Props) {
  const { user } = useContext(AuthContext);
  const popover = usePopover();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  const {
    ID,
    title,
    author,
    category,
    coverUrl,
    CreatedAt,
    UpdatedAt,
    totalViews,
    totalShares,
    totalComments,
    description,
  } = post;

  const handleEdit = () => {
    // ユーザーがログインしているか、またはcurrentPostのauthorIdがuser.uidと一致するかチェック
    if (post.authorId !== user?.uid) {
      enqueueSnackbar('削除権限がありません。', { variant: 'error' });
      return;
    }

    // 編集ページへのリダイレクト
    router.push(paths.dashboard.post.edit(ID));
  };

  const handleClickOpen = () => {
    if (post.authorId !== user?.uid) {
      enqueueSnackbar('削除権限がありません。', { variant: 'error' });
      return;
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // handleDeleteの中のwindow.confirmの代わりにこれを使用します
  const handleConfirmDelete = () => {
    // ここに削除のコードを移動します
    handleDelete();
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${HOST_API}/delete/${ID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      // 成功した場合
      enqueueSnackbar('削除しました！');
      router.push(paths.dashboard.post.root);
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete the post', error);
    }
  };

  const LoginModal = (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">この投稿を本当に削除しますか？</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          この投稿は{title}です。削除すると元に戻せません。
          <br />
          この投稿を削除してもよろしいですか？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          キャンセル
        </Button>
        <Button onClick={handleConfirmDelete} color="error" autoFocus>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Label
              variant="soft"
              color={
                (category === '技術ブログ' && 'info') ||
                (category === '技術書' && 'primary') ||
                (category === '技術系動画' && 'error') ||
                'default'
              }
            >
              {category}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(CreatedAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <Link color="inherit" component={RouterLink} href={paths.dashboard.post.details(ID)}>
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Stack
              spacing={1.5}
              flexGrow={1}
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Stack direction="row" alignItems="center">
                <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalComments)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalViews)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalShares)}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Avatar
              alt={author.name}
              src={author.avatarUrl}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            />
            <Image alt={title} src={coverUrl} sx={{ height: 1, borderRadius: 1.5 }} />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(ID));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          閲覧
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            handleEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          編集
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            handleClickOpen();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          削除
        </MenuItem>
      </CustomPopover>
      {LoginModal}
    </>
  );
}
