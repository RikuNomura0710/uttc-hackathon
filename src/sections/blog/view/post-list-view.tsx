'use client';

import orderBy from 'lodash/orderBy';
// import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetPosts, useSearchPosts } from 'src/api/blog';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceTableToolbar from 'src/sections/invoice/invoice-table-toolbar';
import InvoiceTableFiltersResult from 'src/sections/invoice/invoice-table-filters-result';

import { IPostItem, IPostFilters, IPostFilterValue } from 'src/types/blog';

import PostSort from '../post-sort';
import PostSearch from '../post-search';
import PostListHorizontal from '../post-list-horizontal';

// ----------------------------------------------------------------------

const defaultFilters: IPostFilters = {
  category: 'all',
  tech: [],
  curriculum: '',
};

// ----------------------------------------------------------------------

export default function PostListView() {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const { posts, postsLoading } = useGetPosts();

  const techOptions = ['React', 'Node.js', 'Python'];
  const curriculumOptions = [
    'エディタ(IDE)',
    'OSコマンド(とシェル)',
    'Git',
    'GitHub',
    'HTML&CSS',
    'JavaScript',
    'React',
    'React×TypeScript',
    'SQL',
    'Docker',
    'Go',
    'HTTP Server(Go)',
    'RDBMS(MySQL)へ接続(Go)',
    'Unit Test(Go)',
    'フロントエンドとバックエンドの接続',
    'CI(Continuous Integration)',
    'CD(Continuous Delivery/Deployment)',
    '認証',
    'ハッカソン準備',
    'ハッカソンの概要',
  ];

  // console.log(posts);

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);
  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
    sortBy,
  });

  const POST_SORT_OPTIONS = [
    { value: 'latest', label: '作成日の新しい順' },
    { value: 'oldest', label: '作成日の古い順' },
    { value: 'updatedNewest', label: '更新日の新しい順' },
    { value: 'updatedOldest', label: '更新日の古い順' },
    // ...他の並び替えオプション
  ];

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name: string, value: IPostFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterCategory = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('category', newValue); // ここかえる
    },
    [handleFilters]
  );
  const canReset = !!filters.curriculum || !!filters.tech.length || filters.category !== 'all';

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="コンテンツ"
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
            name: '一覧-',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            投稿
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(ID: string) => paths.dashboard.post.details(ID)}
        />

        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      <Tabs value={filters.category} onChange={handleFilterCategory}>
        {['all', '技術ブログ', '技術書', '技術系動画'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.category) && 'filled') || 'soft'}
                color={
                  (tab === '技術ブログ' && 'info') ||
                  (tab === '技術書' && 'primary') ||
                  (tab === '技術系動画' && 'error') ||
                  'default'
                }
              >
                {tab === 'all' && posts.length}

                {tab === '技術ブログ' &&
                  posts.filter((post) => post.category === '技術ブログ').length}

                {tab === '技術書' && posts.filter((post) => post.category === '技術書').length}

                {tab === '技術系動画' &&
                  posts.filter((post) => post.category === '技術系動画').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>
      <InvoiceTableToolbar
        filters={filters}
        onFilters={handleFilters}
        techOptions={techOptions}
        curriculumOptions={curriculumOptions}
      />

      {canReset && (
        <InvoiceTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          // //
          onResetFilters={handleResetFilters}
          // //
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <PostListHorizontal posts={dataFiltered} loading={postsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

// const applyFilter = ({
//   inputData,
//   filters,
//   sortBy,
// }: {
//   inputData: IPostItem[];
//   filters: IPostFilters;
//   sortBy: string;
// }) => {
//   const { category, } = filters;

//   if (sortBy === 'latest') {
//     inputData = orderBy(inputData, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'oldest') {
//     inputData = orderBy(inputData, ['createdAt'], ['asc']);
//   }

//   if (sortBy === 'popular') {
//     inputData = orderBy(inputData, ['totalViews'], ['desc']);
//   }

//   if (category !== 'all') {
//     inputData = inputData.filter((post) => post.category === category);
//   }

//   return inputData;
// };

const applyFilter = ({
  inputData,
  filters,
  sortBy,
}: {
  inputData: IPostItem[];
  filters: IPostFilters;
  sortBy: string;
}) => {
  const { category, tech, curriculum } = filters;
  switch (sortBy) {
    case 'latest':
      inputData = orderBy(inputData, ['CreatedAt'], ['desc']);
      break;
    case 'oldest':
      inputData = orderBy(inputData, ['CreatedAt'], ['asc']);
      break;
    case 'updatedNewest':
      inputData = orderBy(inputData, ['UpdatedAt'], ['desc']);
      break;
    case 'updatedOldest':
      inputData = orderBy(inputData, ['UpdatedAt'], ['asc']);
      break;
    default:
      // どのケースにも一致しない場合の処理
      // ここでは何もしない、または特定の処理を行う
      break;
  }

  if (category !== 'all') {
    inputData = inputData.filter((post) => post.category === category);
  }

  if (tech.length) {
    // post.tech が単一の文字列であると仮定
    inputData = inputData.filter((post) => tech.includes(post.tech));
  }

  // Curriculum フィルタリング
  if (curriculum) {
    inputData = inputData.filter((post) => post.curriculum === curriculum);
  }

  return inputData;
};
