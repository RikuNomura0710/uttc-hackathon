import { paramCase } from 'src/utils/change-case';

// import { PostDetailsHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Post: Details',
};

type Props = {
  params: {
    id: string;
  };
};

// export default function PostDetailsHomePage({ params }: Props) {
//   const { title } = params;

//   return <PostDetailsHomeView title={title} />;
// }

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }

// export default function PostDetailsPage() {
//   const title = 'dummy-title';

//   return <PostDetailsHomeView title={title} />;
// }
export default function PostDetailsPage() {
  return <div>hello!</div>;
}
// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }

export async function generateStaticParams() {
  // ダミーデータを作成します
  const dummyPosts = [{ id: '1' }, { id: '2' }];

  return dummyPosts.map((post: { id: string }) => ({
    id: paramCase(post.id),
  }));
}
