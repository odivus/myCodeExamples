/**
 * Пример на основе реального slice приложения банка.
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ICryptoSettings,
  EHashAlgorithm,
  ESignatureAlgorithm,
  EKeyStoreType,
} from '../types/cryptoSettings.types';

export enum ELoadStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

interface ICryptoSettingsState {
  data: ICryptoSettings | null;
  loadStatus: ELoadStatus;
  saveStatus: ELoadStatus;
  loadError: string | null;
  saveError: string | null;
}

const initialState: ICryptoSettingsState = {
  data: null,
  loadStatus: ELoadStatus.IDLE,
  saveStatus: ELoadStatus.IDLE,
  loadError: null,
  saveError: null,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockCryptoSettings: ICryptoSettings = {
  hashAlgorithm: EHashAlgorithm.GOST_R_34_11_2012_256,
  signatureAlgorithm: ESignatureAlgorithm.GOST_R_34_10_2012_256,
  keyStoreType: EKeyStoreType.HSM,
  keyLifetimeDays: 365,
  certificateIssuer: 'CN=УЦ Банка России, O=Банк России, C=RU',
  ocspUrl: 'https://ocsp.cbr.ru/ocsp',
  crlUrl: 'https://crl.cbr.ru/crl/cbr.crl',
  timestampUrl: 'https://tsp.cbr.ru/tsp',
  pinCodeLength: 6,
  autoRenewDaysBefore: 30,
};

export const fetchCryptoSettings = createAsyncThunk<
  ICryptoSettings,
  void,
  { rejectValue: string }
>('cryptoSettings/fetch', async (_, { rejectWithValue }) => {
  try {
    await delay(800);
    return mockCryptoSettings;
  } catch {
    return rejectWithValue('Не удалось загрузить настройки криптографии');
  }
});

export const saveCryptoSettings = createAsyncThunk<
  ICryptoSettings,
  ICryptoSettings,
  { rejectValue: string }
>('cryptoSettings/save', async (settings, { rejectWithValue }) => {
  try {
    await delay(600);
    return settings;
  } catch {
    return rejectWithValue('Не удалось сохранить настройки');
  }
});

const cryptoSettingsSlice = createSlice({
  name: 'cryptoSettings',
  initialState,
  reducers: {
    resetSaveStatus(state) {
      state.saveStatus = ELoadStatus.IDLE;
      state.saveError = null;
    },
    resetLoadStatus(state) {
      state.loadStatus = ELoadStatus.IDLE;
      state.loadError = null;
    },
    clearErrors(state) {
      state.loadError = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoSettings.pending, (state) => {
        state.loadStatus = ELoadStatus.LOADING;
        state.loadError = null;
      })
      .addCase(fetchCryptoSettings.fulfilled, (state, action) => {
        state.loadStatus = ELoadStatus.SUCCESS;
        state.data = action.payload;
      })
      .addCase(fetchCryptoSettings.rejected, (state, action) => {
        state.loadStatus = ELoadStatus.ERROR;
        state.loadError =
          action.payload ?? action.error.message ?? 'Не удалось загрузить настройки криптографии';
      })
      .addCase(saveCryptoSettings.pending, (state) => {
        state.saveStatus = ELoadStatus.LOADING;
        state.saveError = null;
      })
      .addCase(saveCryptoSettings.fulfilled, (state, action) => {
        state.saveStatus = ELoadStatus.SUCCESS;
        state.data = action.payload;
      })
      .addCase(saveCryptoSettings.rejected, (state, action) => {
        state.saveStatus = ELoadStatus.ERROR;
        state.saveError = action.payload ?? action.error.message ?? 'Не удалось сохранить настройки';
      });
  },
});

export const { resetSaveStatus, resetLoadStatus, clearErrors } = cryptoSettingsSlice.actions;
export default cryptoSettingsSlice.reducer;