import { useState, useEffect } from 'react';

import { HOST_API } from 'src/config-global';

import { IUserProfileUTTC } from 'src/types/user';

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
export function useGetUser(id: string) {
  const [user, setUser] = useState<IUserProfileUTTC | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`${HOST_API}/user/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setUser(data.user);
          setUserLoading(false);
        })
        .catch((error) => {
          setUserError(error);
          setUserLoading(false);
        });
    } else {
      setUserLoading(false);
    }
  }, [id]);

  return {
    user,
    userLoading,
    userError,
    userEmpty: user === null,
  };
}
