import { useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import Stack, { StackProps } from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { AuthContext } from 'src/auth/context/firebase/auth-context';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

type Props = StackProps & {
  currentPost: IPostItem;
  id: string;
  title: string;
  backLink: string;
  editLink: string;
  liveLink: string;
  category: string;
  onChangeCategory: (newValue: string) => void;
  categoryOptions: {
    value: string;
    label: string;
  }[];
};

export default function PostDetailsToolbar({
  currentPost,
  id,
  title,
  category,
  backLink,
  editLink,
  liveLink,
  categoryOptions,
  onChangeCategory,
  sx,
  ...other
}: Props) {
  const { user } = useContext(AuthContext);
  const popover = usePopover();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    if (!user?.uid || (currentPost && currentPost.authorId !== user.uid)) {
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
      const response = await fetch(`http://localhost:8080/delete/${id}`, {
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

  const handleEdit = () => {
    // ユーザーがログインしているか、またはcurrentPostのauthorIdがuser.uidと一致するかチェック
    if (!user?.uid || (currentPost && currentPost.authorId !== user.uid)) {
      enqueueSnackbar('編集権限がありません。', { variant: 'error' });
      return;
    }
    // 編集ページへのリダイレクト
    router.push(editLink);
  };

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          戻る
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* {category === '技術ブログ' && ( // ここについて
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )} */}

        {/* <Tooltip title="削除">
          <IconButton onClick={() => handleClickOpen()} component={RouterLink} href={liveLink}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="削除">
          <IconButton onClick={handleClickOpen}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip>

        <Tooltip title="編集">
          <IconButton onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!category}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {category}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {categoryOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === category}
            onClick={() => {
              popover.onClose();
              onChangeCategory(option.value);
            }}
          >
            {option.value === '技術ブログ' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === '技術書' && <Iconify icon="solar:file-text-bold" />}
            {option.value === '技術系動画' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
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
    </>
  );
}
