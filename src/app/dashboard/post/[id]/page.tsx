import { HOST_API } from 'src/config-global';

import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'UTTC | コンテンツ詳細',
};

type Props = {
  params: {
    id: string;
  };
};

export default function PostDetailsPage({ params }: Props) {
  const { id } = params;
  console.log('id:', id);

  return <PostDetailsView id={id} />;
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${HOST_API}/posts`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('data.id:', data.id);
    return data.posts.map((post: { id: string }) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    // throw error;
    return [];
  }
}
