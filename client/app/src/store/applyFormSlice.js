
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,
  form: {
    step1: {},
    step2: {},
    step3: {},
    step4: {
      documents: []
    },
    step5: {},
    step6: {},
    step7: {},
  },
  price: 0,
  applicationId: null,
};

const applyFormSlice = createSlice({
  name: "applyForm",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    updateStep1: (state, action) => {
      state.form.step1 = { ...state.form.step1, ...action.payload };
    },
    updateStep2: (state, action) => {
      state.form.step2 = { ...state.form.step2, ...action.payload };
    },
    updateStep3: (state, action) => {
      state.form.step3 = { ...state.form.step3, ...action.payload };
    },
    updateStep4: (state, action) => {
      state.form.step4 = { ...state.form.step4, ...action.payload };
    },
    updateStep5: (state, action) => {
      state.form.step5 = { ...state.form.step5, ...action.payload };
    },
    updateStep6: (state, action) => {
      state.form.step6 = { ...state.form.step6, ...action.payload };
    },
    updateStep7: (state, action) => {
      state.form.step7 = { ...state.form.step7, ...action.payload };
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setApplicationId: (state, action) => {
      state.applicationId = action.payload;
    },
    addDocument: (state, action) => {
      const { documentType, documentData } = action.payload;
      const existingIndex = state.form.step3.documents.findIndex(
        doc => doc.document_type === documentType
      );
      
      if (existingIndex >= 0) {
        state.form.step3.documents[existingIndex] = documentData;
      } else {
        state.form.step3.documents.push(documentData);
      }
    },
    removeDocument: (state, action) => {
      const documentType = action.payload;
      state.form.step3.documents = state.form.step3.documents.filter(
        doc => doc.document_type !== documentType
      );
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setStep,
  updateStep1,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  updateStep6,
  updateStep7,
  setPrice,
  setApplicationId,
  addDocument,
  removeDocument,
  resetForm,
} = applyFormSlice.actions;

export default applyFormSlice.reducer;
