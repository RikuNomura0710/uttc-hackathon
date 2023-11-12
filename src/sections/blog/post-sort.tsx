import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
type SortList = {
  [key: string]: string;
};
type Props = {
  sort: string;
  onSort: (newValue: string) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
};

export default function PostSort({ sort, sortOptions, onSort }: Props) {
  const popover = usePopover();
  const sortList: SortList = {
    latest: '作成日の新しい順',
    oldest: '作成日の古い順',
    updatedNewest: '更新日の新しい順',
    updatedOldest: '更新日の古い順',
    // ...他の並び替えオプションがあればここに追加
    popular: '人気順',
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
      >
        並び替え:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {sortList[sort]}
        </Box>
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sort === option.value}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
