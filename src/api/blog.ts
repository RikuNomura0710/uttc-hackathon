import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

// export function useGetPosts() {
//   // const URL = endpoints.post.list;
//   const URL = '/posts';

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       posts: (data?.posts as IPostItem[]) || [],
//       postsLoading: isLoading,
//       postsError: error,
//       postsValidating: isValidating,
//       postsEmpty: !isLoading && !data?.posts.length,
//     }),
//     [data?.posts, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

export function useGetPosts() {
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.posts);
        setPostsLoading(false);
      })
      .catch((error) => {
        setPostsError(error);
        setPostsLoading(false);
      });
  }, []);

  return {
    posts,
    postsLoading,
    postsError,
    postsEmpty: posts.length === 0,
  };
}

// ----------------------------------------------------------------------

// export function useGetPost(title: string) {
//   const URL = title ? [endpoints.post.details, { params: { title } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       post: data?.post as IPostItem,
//       postLoading: isLoading,
//       postError: error,
//       postValidating: isValidating,
//     }),
//     [data?.post, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
export function useGetPost(id: string) {
  const [post, setPost] = useState<IPostItem | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/posts/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setPost(data.post);
          setPostLoading(false);
        })
        .catch((error) => {
          setPostError(error);
          setPostLoading(false);
        });
    } else {
      setPostLoading(false);
    }
  }, [id]);

  return {
    post,
    postLoading,
    postError,
    postEmpty: post === null,
  };
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title: string) {
  const URL = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: (data?.latestPosts as IPostItem[]) || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query: string) {
  const URL = query ? [endpoints.post.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IPostItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
