
'use client'

import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/languageSlice.js';

export function useLanguage() {
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const dispatch = useDispatch();

  const changeLanguage = (language) => {
    dispatch(setLanguage(language));
  };

  return {
    currentLanguage,
    changeLanguage
  };
}
