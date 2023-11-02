import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack, { StackProps } from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
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
  category,
  backLink,
  editLink,
  liveLink,
  categoryOptions,
  onChangeCategory,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

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

        {category === '技術ブログ' && ( // ここについて
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
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
    </>
  );
}
