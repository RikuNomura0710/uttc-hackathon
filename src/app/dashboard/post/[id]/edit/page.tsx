import { HOST_API } from 'src/config-global';

import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'UTTC | 編集',
};

type Props = {
  params: {
    id: string;
  };
};

export default function PostEditPage({ params }: Props) {
  const { id } = params;

  return <PostEditView id={id} />;
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${HOST_API}/posts`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // return data.posts.map((post: { id: string }) => ({
    //   id: paramCase(post.id),
    // }));
    return data.posts.map((post: { id: string }) => ({
      id: post.id,
    }));
  } catch (error) {
    // throw error;
    console.error('Fetch error:', error);
    // 静的生成を続行するためのデフォルト値を返す
    return [];
  }
}
