import { paramCase } from 'src/utils/change-case';

import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'UTTC | コンテンツ詳細',
};

type Props = {
  params: {
    title: string;
  };
};

export default function PostDetailsPage({ params }: Props) {
  const { title } = params;

  return <PostDetailsView title={title} />;
}

// export default function PostDetailsPage() {
//   const title = 'dummy-title';

//   return <PostDetailsView title={title} />;
// }

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }

// export async function generateStaticParams() {
//   // ダミーデータを作成します
//   const dummyPosts = [{ title: 'dummy-title-1' }, { title: 'dummy-title-2' }];

//   return dummyPosts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }
export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:8080/posts');

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    return data.posts.map((post: { title: string }) => ({
      title: paramCase(post.title),
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
