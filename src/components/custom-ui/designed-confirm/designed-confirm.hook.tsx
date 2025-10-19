'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type DesignedConfirmStore = {
  message: string;
  setMessage: (message: string) => void;

  confirmButtonText: string;
  setConfirmButtonText: (text: string) => void;

  isOpened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;

  clearStates: () => void;
};

export const useDesignedConfirmStore = create<DesignedConfirmStore>()(
  subscribeWithSelector((set) => ({
    message: '',
    setMessage: (message: string) => {
      set((prev) => ({ ...prev, message }));
    },

    confirmButtonText: '확인',
    setConfirmButtonText: (text: string) => {
      set((prev) => ({ ...prev, confirmButtonText: text }));
    },

    isOpened: false,
    open: () => {
      set((prev) => ({ ...prev, isOpened: true }));
    },
    close: () => {
      set((prev) => ({ ...prev, isOpened: false }));
    },
    toggle: () => {
      set((prev) => ({ ...prev, isOpened: !prev.isOpened }));
    },

    onConfirm: null,
    onCancel: null,

    clearStates: () => {
      set((state) => ({
        ...state,
        isOpened: false,
        onConfirm: null,
        onCancel: null,
      }));
    },
  })),
);

export const asyncConfirm = (message: string, option?: { buttonText: string }) => {
  const { open, setConfirmButtonText, setMessage, clearStates } = useDesignedConfirmStore.getState();

  setConfirmButtonText(option?.buttonText || '확인');
  setMessage(message);
  open();

  return new Promise<boolean>((resolve, reject) => {
    useDesignedConfirmStore.setState((state) => {
      return {
        ...state,
        onConfirm: () => {
          resolve(true);
          clearStates();
        },
        onCancel: () => {
          resolve(false);
          clearStates();
        },
      };
    });
  });
};
