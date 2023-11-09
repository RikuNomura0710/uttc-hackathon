import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { IUserProfileUTTC } from 'src/types/user';

// ----------------------------------------------------------------------
type Props = {
  currentProfile?: IUserProfileUTTC | null;
};

export default function AccountGeneral({ currentProfile }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('名前は必須です'),
    photoURL: Yup.mixed<any>().nullable().required('写真は必須です'),
    class: Yup.string().required('クラスは必須です'),
    faculty: Yup.string().required('学部は必須です'),
    department: Yup.string().required('学科は必須です'),
    grade: Yup.string().required('学年は必須です'),
    can: Yup.string().required('技術スタックは必須です'),
    did: Yup.string().required('どのような技術プロジェクトに携わってきましたか？'),
    will: Yup.string().required('どのような技術やプロジェクトに携わりたいですか？'),
    isPublic: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: currentProfile?.displayName || '',
      photoURL: currentProfile?.photoURL || null,
      class: currentProfile?.class || '',
      faculty: currentProfile?.faculty || '',
      department: currentProfile?.department || '',
      grade: currentProfile?.grade || '',
      can: currentProfile?.can || '',
      did: currentProfile?.did || '',
      will: currentProfile?.will || '',
      isPublic: currentProfile?.isPublic || false,
    }),
    [currentProfile]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProfile) {
      reset(defaultValues);
    }
  }, [currentProfile, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      const url = currentProfile
        ? // ? `http://localhost:8080/edit/${encodeURIComponent(currentProfile.title)}` // 更新用URL
          `http://localhost:8080/update-user/${currentProfile.id}`
        : 'http://localhost:8080/create-user'; // 新規作成用URL
      const method = currentProfile ? 'PUT' : 'POST'; // 更新はPUT、新規作成はPOST

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        throw new Error(`Network response was not ok ${response.statusText}`);
      }

      reset();
      enqueueSnackbar(currentProfile ? '更新しました！' : '投稿しました！');
      // router.push(paths.dashboard.post.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  *.jpeg, *.jpg, *.png, *.gifが使えます。
                  <br /> 最大サイズは {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="プロフィールを公開"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              削除する
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="displayName" label="名前" />
              <RHFTextField name="class" label="クラス" />
              <RHFTextField name="faculty" label="学部" />
              <RHFTextField name="department" label="学科" />
              <RHFTextField name="grade" label="学年" />

              {/* <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="can" multiline rows={2} label="技術スタック" />
              <RHFTextField
                name="did"
                multiline
                rows={2}
                label="どのような技術プロジェクトに携わってきましたか？"
              />
              <RHFTextField
                name="will"
                multiline
                rows={2}
                label="どのような技術やプロジェクトに携わりたいですか？"
              />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentProfile ? '投稿する' : '変更を保存'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
