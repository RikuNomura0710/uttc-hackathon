// ----------------------------------------------------------------------

export type IPostFilterValue = string | string[];

export type IPostFilters = {
  // publish: string;
  category: string;
  curriculum: string;
  tech: string[];
};

// ----------------------------------------------------------------------

export type IPostHero = {
  title: string;
  coverUrl: string;
  createdAt?: Date;
  author?: {
    name: string;
    avatarUrl: string;
  };
};

export type IPostComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: Date;
  users: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    postedAt: Date;
    tagUser?: string;
  }[];
};

// export type IPostItem = {
//   id: string;
//   title: string;
//   tags: string[];
//   // publish: string;
//   category: string;
//   content: string;
//   coverUrl: string;
//   metaTitle: string;
//   totalViews: number;
//   totalShares: number;
//   description: string;
//   totalComments: number;
//   totalFavorites: number;
//   metaKeywords: string[];
//   metaDescription: string;
//   comments: IPostComment[];
//   createdAt: Date;
//   favoritePerson: {
//     name: string;
//     avatarUrl: string;
//   }[];
//   author: {
//     name: string;
//     avatarUrl: string;
//   };
// };
export type IPostItem = {
  ID: string;
  title: string;
  authorId: string;
  // tags: string;
  // publish: string;
  category: string;
  tech: string;
  curriculum: string;
  content: string;
  coverUrl: string;
  metaTitle: string;
  totalViews: number;
  totalShares: number;
  description: string;
  totalComments: number;
  totalFavorites: number;
  // metaKeywords: string;
  metaDescription: string;
  // comments: IPostComment[];
  CreatedAt: Date;
  UpdatedAt: Date;
  // favoritePerson: {
  //   name: string;
  //   avatarUrl: string;
  // }[];
  author: {
    name: string;
    avatarUrl: string;
  };
};
