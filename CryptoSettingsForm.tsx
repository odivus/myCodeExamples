import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AlgorithmsGroup } from '../molecules/AlgorithmsGroup';
import { KeySettingsGroup } from '../molecules/KeySettingsGroup';
import { CertificateGroup } from '../molecules/CertificateGroup';
import { FormActions } from '../molecules/FormActions';
import { cryptoSettingsSchema, TCryptoSettingsFormValues } from '../types/cryptoSettingsSchema';
import { ICryptoSettings } from '../types/cryptoSettings.types';
import { ELoadStatus } from '../store/cryptoSettingsSlice';
import styles from './CryptoSettingsForm.module.scss';

interface ICryptoSettingsFormProps {
  initialValues: ICryptoSettings;
  saveStatus: ELoadStatus;
  onSubmit: (values: TCryptoSettingsFormValues) => void;
}

/**
 * Пример на основе реальной страницы приложения сервиса криптографии банка.
 */

export const CryptoSettingsForm: React.FC<ICryptoSettingsFormProps> = ({
  initialValues,
  saveStatus,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const isSaving = saveStatus === ELoadStatus.LOADING;
  const isSaveError = saveStatus === ELoadStatus.ERROR;
  const isSaveSuccess = saveStatus === ELoadStatus.SUCCESS;

  const methods = useForm<TCryptoSettingsFormValues>({
    resolver: yupResolver<TCryptoSettingsFormValues>(cryptoSettingsSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const { reset, formState: { isDirty, isValid } } = methods;

  // Если initialValues может приходить асинхронно или меняться, используем reset без methods в зависимостях
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className={styles.root}
      >
        <Paper className={styles.paper} elevation={2}>
          {isSaveSuccess && (
            <Alert severity="success" className={styles.alert}>
              Настройки успешно сохранены
            </Alert>
          )}
          {isSaveError && (
            <Alert severity="error" className={styles.alert}>
              Ошибка при сохранении. Попробуйте ещё раз.
            </Alert>
          )}

          <Box className={styles.section}>
            <AlgorithmsGroup />
          </Box>

          <Box className={styles.section}>
            <KeySettingsGroup />
          </Box>

          <Box className={styles.section}>
            <CertificateGroup />
          </Box>

          <FormActions
            isSaving={isSaving}
            isDirty={isDirty}
            isValid={isValid}
            onCancel={handleCancel}
          />
        </Paper>
      </Box>
    </FormProvider>
  );
};