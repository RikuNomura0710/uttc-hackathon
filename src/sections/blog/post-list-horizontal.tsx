import { useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { IPostItem } from 'src/types/blog';

import { PostItemSkeleton } from './post-skeleton';
import PostItemHorizontal from './post-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
  loading?: boolean;
};

export default function PostListHorizontal({ posts, loading }: Props) {
  const [page, setPage] = useState(1);
  const postsPerPage = 8;

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = posts.slice(start, end);

  const renderList = (
    <>
      {currentPosts.map((post) => (
        <PostItemHorizontal key={post.ID} post={post} />
      ))}
    </>
  );

  // ページネーションの合計ページ数を計算
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <PostItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
