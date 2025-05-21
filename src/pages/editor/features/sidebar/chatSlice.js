import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  selectedModel: "Gemini 2.0 Flash",
  models: [
    {
      id: "Gemini 2.0 Flash",
      name: "Gemini 2.0 Flash",
      icon: "SiGooglegemini",
    },

    { id: "DeepSeek-R1", name: "DeepSeek-R1", icon: "BsRobot" },
    { id: "OpenChat 3.5 7B", name: "OpenChat 3.5 7B", icon: "TbBrandOpenai" },
    {
      id: "Mistral 7B Instruct",
      name: "Mistral 7B Instruct",
      icon: "FaRobot",
    },
    {
      id: "Meta Llama 3 8B Instruct",
      name: "Meta Llama 3 8B Instruct",
      icon: "SiMeta",
    },
    {
      id: "Microsoft Phi 3 Medium 128K Instruct",
      name: "Microsoft Phi 3 Medium 128K Instruct",
      icon: "BsStars",
    },
    {
      id: "Qwen 2.5 Coder 32B Instruct",
      name: "Qwen 2.5 Coder 32B Instruct",
      icon: "FaRobot",
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessageRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      // Add user message immediately
      state.messages.push({
        role: "user",
        content: action.payload.question,
        timestamp: new Date().toISOString(),
      });
    },
    sendMessageSuccess: (state, action) => {
      state.isLoading = false;
      state.messages.push({
        role: "assistant",
        content: action.payload.data,
        timestamp: new Date().toISOString(),
        model: state.selectedModel,
      });
    },
    sendMessageFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  setSelectedModel,
  clearChat,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
