import * as Yup from 'yup';
import OpenAI from 'openai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { HOST_API, OPENAI_API } from 'src/config-global';
import { AuthContext } from 'src/auth/context/firebase/auth-context';

import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IPostItem } from 'src/types/blog';

import PostDetailsPreview from './post-details-preview';

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem | null;
};

export default function PostNewEditForm({ currentPost }: Props) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();
  const techOptions = ['React', 'Vue', 'Angular'];
  const curriculumOptions = ['Frontend', 'Backend', 'Fullstack'];
  const categoryOptions = ['Web Development', 'Mobile Development', 'Data Science'];

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    tech: Yup.string().required('Tech is required'), // tech を追加
    curriculum: Yup.string().required('Curriculum is required'), // curriculum を追加
    description: Yup.string().required('Description is required'),
    content: Yup.string().required('Content is required'),
    coverUrl: Yup.mixed<any>().nullable().required('Cover is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    // not required
    metaTitle: Yup.string(),
    metaDescription: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      tech: currentPost?.tech || '',
      curriculum: currentPost?.curriculum || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      coverUrl: currentPost?.coverUrl || null,
      // tags: currentPost?.tags || [],
      // metaKeywords: currentPost?.metaKeywords || [],
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  // ログインページへのリダイレクトを行う関数
  const redirectToLogin = () => {
    router.push(paths.auth.firebase.login); // あなたのログインページのパスに置き換えてください
  };

  const onSubmit = handleSubmit(async (data) => {
    // ユーザーがログインしているかチェック
    if (!user?.uid) {
      // ユーザーがログインしていなければログインを促すモーダルを表示
      setOpenDialog(true);
      return;
    }

    try {
      const { coverUrl, ...restData } = data; // coverUrlを除外
      // ここでauthorIdを追加しています
      const postData = { ...restData, authorId: user.uid };

      const url = currentPost
        ? `${HOST_API}/edit/${currentPost.ID}` // 更新用URLには投稿のIDを使用
        : `${HOST_API}/create-post`; // 新規作成用URL
      const method = currentPost ? 'PUT' : 'POST'; // 更新はPUT、新規作成はPOST

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // 必要に応じて認証ヘッダーを追加する
          // 'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.error}`);
      }

      // 投稿が成功したらフォームをリセットし、メッセージを表示
      reset();
      preview.onFalse();
      enqueueSnackbar(currentPost ? '更新しました！' : '投稿しました！', { variant: 'success' });
      router.push(paths.dashboard.post.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('投稿中にエラーが発生しました。', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  // ----------------------------------------------------------------------

  const openAi = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
  });

  const summarizeText = async (text: string): Promise<string | null> => {
    if (!text) {
      enqueueSnackbar('内容が書かれていません', { variant: 'error' });
      return '';
    }

    try {
      const completion = await openAi.chat.completions.create({
        model: 'gpt-3.5-turbo-1106', // 使用するモデル
        messages: [
          {
            role: 'system',
            content: '要約してください。',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('要約中にエラーが発生しました: ', error);
      enqueueSnackbar('要約中にエラーが発生しました。', { variant: 'error' });
      throw error;
    }
  };

  const handleSummarize = async () => {
    const content = watch('content'); // 'content'は要約するテキストフィールドの名前
    const summary = await summarizeText(content);
    if (summary) {
      setValue('description', summary); // 要約を説明フィールドに設定
    }
  };

  const generateImage = async () => {
    try {
      const prompt = watch('description');
      if (!prompt) {
        enqueueSnackbar('説明が必要です', { variant: 'error' });
        return;
      }

      const response = await openAi.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      if (response.data && response.data.length > 0) {
        setValue('coverUrl', response.data[0].url);
      } else {
        enqueueSnackbar('画像を生成できませんでした', { variant: 'error' });
      }
    } catch (error) {
      console.error('画像生成中にエラーが発生しました: ', error);
      enqueueSnackbar('画像生成中にエラーが発生しました', { variant: 'error' });
    }
  };

  // ----------------------------------------------------------------------

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            詳細
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            タイトル, カテゴリー、説明, 画像...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="タイトル" />

            {/* <RHFTextField name="tech" label="テック" />

            <RHFTextField name="curriculum" label="カリキュラム" />

            <RHFTextField name="category" label="カテゴリー" /> */}
            <RHFAutocomplete
              name="tech"
              label="タグ"
              placeholder="技術を選択"
              multiple
              freeSolo
              options={techOptions}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFAutocomplete
              name="tech"
              label="カリキュラム"
              placeholder="カリキュラムを選択"
              multiple
              freeSolo
              options={curriculumOptions}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFAutocomplete
              name="category"
              label="カテゴリー"
              placeholder="カテゴリーを選択"
              multiple
              freeSolo
              options={categoryOptions}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFTextField name="description" label="説明" multiline rows={3} />

            <Button
              variant="contained"
              color="info"
              onClick={handleSummarize}
              disabled={isSubmitting}
            >
              要約する
            </Button>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">内容</Typography>
              <RHFEditor simple name="content" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">カバー画像</Typography>
              <RHFUpload
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
              <Button variant="contained" color="info" onClick={generateImage}>
                画像生成
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            プロパティ
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            タグ, SEO, コメント...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFAutocomplete
              name="tags"
              label="タグ"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            <RHFTextField name="metaTitle" label="タイトル" />

            <RHFTextField name="metaDescription" label="説明" fullWidth multiline rows={3} />

            {/* <RHFAutocomplete
              name="metaKeywords"
              label="キーワード"
              placeholder="+ Keywords"
              multiple
              freeSolo
              disableCloseOnSelect
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            <FormControlLabel
              control={<Switch defaultChecked color="info" />}
              label="コメントを許可"
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked color="info" />}
          label="公開する"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          プレビュー
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? '投稿する' : '変更を保存'}
        </LoadingButton>
      </Grid>
    </>
  );

  const LoginModal = (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          投稿を作成するにはログインが必要です。ログインページに移動しますか？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          キャンセル
        </Button>
        <Button onClick={redirectToLogin} color="error" autoFocus>
          ログイン
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderActions}
        </Grid>

        <PostDetailsPreview
          title={values.title}
          content={values.content}
          description={values.description}
          coverUrl={
            typeof values.coverUrl === 'string'
              ? values.coverUrl
              : `${(values.coverUrl as CustomFile)?.preview}`
          }
          //
          open={preview.value}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onClose={preview.onFalse}
          onSubmit={onSubmit}
        />
      </FormProvider>
      {LoginModal}
    </>
  );
}
