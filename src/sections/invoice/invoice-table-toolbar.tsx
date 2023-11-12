import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// import { usePopover } from 'src/components/custom-popover';

import { IPostFilters, IPostFilterValue } from 'src/types/blog';

// ----------------------------------------------------------------------

// type Props = {
//   filters: IInvoiceTableFilters;
//   onFilters: (name: string, value: IInvoiceTableFilterValue) => void;
//   //
//   dateError: boolean;
//   serviceOptions: string[];
// };
type Props = {
  filters: IPostFilters;
  onFilters: (name: string, value: IPostFilterValue) => void;
  //
  // dateError: boolean;
  techOptions: string[];
  curriculumOptions: string[];
};

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  //
  // dateError,
  techOptions,
  curriculumOptions,
}: Props) {
  // const popover = usePopover();
  const handleFilterCurriculum = useCallback(
    (event: SelectChangeEvent<string>) => {
      // 型を SelectChangeEvent<string> に変更
      onFilters('curriculum', event.target.value); // event.target.value は既に文字列なので、そのまま使用
    },
    [onFilters]
  );

  const handleFilterTech = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'tech',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
        mb: { xs: 1, md: 2 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>Tech</InputLabel>

        <Select
          multiple
          value={filters.tech}
          onChange={handleFilterTech}
          input={<OutlinedInput label="Tech" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          sx={{ textTransform: 'capitalize' }}
        >
          {techOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                color="info"
                size="small"
                checked={filters.tech.includes(option)}
              />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>Curriculum</InputLabel>
        <Select
          value={filters.curriculum}
          onChange={handleFilterCurriculum} // 単一選択のための適切なハンドラーに変更
          input={<OutlinedInput label="Curriculum" />} // ラベルも適切なものに変更
          // renderValue 不要、単一選択のため標準の表示方法を使用
          sx={{ textTransform: 'capitalize' }}
        >
          {curriculumOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
