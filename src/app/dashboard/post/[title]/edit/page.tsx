import { paramCase } from 'src/utils/change-case';
import axios, { endpoints } from 'src/utils/axios';

import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'UTTC | 編集',
};

type Props = {
  params: {
    title: string;
  };
};

export default function PostEditPage({ params }: Props) {
  const { title } = params;

  return <PostEditView title={title} />;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }

export async function getStaticPaths() {
  const res = await axios.get(endpoints.post.list);

  const paths = res.data.posts.map((post: { title: string }) => ({
    params: { title: paramCase(post.title) },
  }));

  return { paths, fallback: false };
}
