import React, { useEffect } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../Store/Hooks';
import {
  fetchCryptoSettings,
  saveCryptoSettings,
  resetSaveStatus,
  ELoadStatus,
} from '../store/cryptoSettingsSlice';
import { CryptoSettingsForm } from '../organisms/CryptoSettingsForm';
import { TCryptoSettingsFormValues } from '../types/cryptoSettingsSchema';
import styles from './CryptoSettingsPage.module.scss';

/**
 * Пример на основе реального компонента приложения банка.
 */
export const CryptoSettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loadStatus, saveStatus, loadError } = useAppSelector(
    (state) => state.cryptoSettings
  );

  const isLoading = loadStatus === ELoadStatus.LOADING;
  const isLoadError = loadStatus === ELoadStatus.ERROR;

  useEffect(() => {
    dispatch(resetSaveStatus());
    dispatch(fetchCryptoSettings());
  }, [dispatch]);

  const handleSubmit = (values: TCryptoSettingsFormValues) => {
    dispatch(saveCryptoSettings(values));
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" component="h1" className={styles.title}>
          Настройки криптографии
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Параметры криптографической защиты информации
        </Typography>
      </Box>

      {isLoading && (
        <Box className={styles.centered}>
          <CircularProgress />
        </Box>
      )}

      {isLoadError && (
        <Box className={styles.centered}>
          <Typography color="error">
            {loadError ?? 'Не удалось загрузить настройки. Попробуйте обновить страницу.'}
          </Typography>
        </Box>
      )}

      {!isLoading && !isLoadError && !data && (
        <Box className={styles.centered}>
          <Typography>Настройки не найдены.</Typography>
        </Box>
      )}

      {!isLoading && !isLoadError && data && (
        <CryptoSettingsForm
          initialValues={data}
          saveStatus={saveStatus}
          onSubmit={handleSubmit}
        />
      )}
    </Container>
  );
};