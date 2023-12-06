import { createAction } from '@reduxjs/toolkit';

export const redirectAction = createAction<string>('app/redirectToRoute');
export const setPageNumber = createAction<string>('user/setPageNumber');
