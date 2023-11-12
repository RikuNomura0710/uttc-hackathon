import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { IPostFilters, IPostFilterValue } from 'src/types/blog';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IPostFilters;
  onFilters: (name: string, value: IPostFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function InvoiceTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveService = (inputValue: string) => {
    const newValue = filters.tech.filter((item) => item !== inputValue);
    onFilters('tech', newValue);
  };

  const handleRemoveCurriuculum = () => {
    onFilters('curriculum', 'all');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.tech.length && (
          <Block label="tech:">
            {filters.tech.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveService(item)}
              />
            ))}
          </Block>
        )}

        {filters.curriculum !== 'all' && (
          <Block label="curriculum:">
            <Chip size="small" label={filters.curriculum} onDelete={handleRemoveCurriuculum} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
