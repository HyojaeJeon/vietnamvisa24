import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/languageSlice.js';

export const useLanguage = () => {
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const dispatch = useDispatch();

  const changeLanguage = (language) => {
    dispatch(setLanguage(language));
  };

  return {
    currentLanguage,
    changeLanguage,
  };
};