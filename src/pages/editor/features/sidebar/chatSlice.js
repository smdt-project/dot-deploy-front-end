import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  initialInput: "",
  selectedModel: "Gemini 2.0 Flash",
  models: [
    {
      id: "Gemini 2.0 Flash",
      name: "Gemini 2.0 Flash",
      icon: "SiGooglegemini",
    },
    {
      id: "DeepSeek: DeepSeek V3 0324",
      name: "DeepSeek: DeepSeek V3 0324",
      icon: "BsRobot",
    },
    {
      id: "OpenGVLab: InternVL3 14B",
      name: "OpenGVLab: InternVL3 14B",
      icon: "TbBrandOpenai",
    },
    {
      id: "Mistral 7B Instruct",
      name: "Mistral 7B Instruct",
      icon: "FaRobot",
    },
    {
      id: "Meta: Llama 3.1 8B Instruct",
      name: "Meta: Llama 3.1 8B Instruct",
      icon: "SiMeta",
    },
    {
      id: "NVIDIA: Llama 3.3 Nemotron Super 49B v1",
      name: "NVIDIA: Llama 3.3 Nemotron Super 49B v1",
      icon: "TbBrandOpenai",
    },
    {
      id: "Microsoft Phi 4 Reasoning",
      name: "Microsoft Phi 4 Reasoning",
      icon: "SiMicrosoft",
    },
    {
      id: "Moonshot AI Moonlight 16B A3B Instruct",
      name: "Moonshot AI Moonlight 16B A3B Instruct",
      icon: "SiMoonshot",
    },
    {
      id: "Microsoft: MAI DS R1",
      name: "Microsoft: MAI DS R1",
      icon: "BsStars",
    },
    {
      id: "Moonshot AI Kimi VL A3B Thinking",
      name: "Moonshot AI Kimi VL A3B Thinking",
      icon: "SiMoonshot",
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
    setInputText: (state, action) => {
      console.log(
        "CHAT SLICE: setInputText reducer called. Payload:",
        action.payload
      );
      state.initialInput = action.payload;
    },
    clearInitialInput: (state) => {
      console.log("CHAT SLICE: clearInitialInput reducer called.");
      state.initialInput = "";
    },
    bugDetectionRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      // Add a "analyzing" message immediately
      state.messages.push({
        role: "user",
        content: "Detect my code for bugs...",
        timestamp: new Date().toISOString(),
        type: "bug-detection",
      });
    },
    bugDetectionSuccess: (state, action) => {
      state.isLoading = false;
      state.messages.push({
        role: "assistant",
        content: action.payload.data,
        timestamp: new Date().toISOString(),
        model: "Bug Detection AI",
        type: "bug-detection",
      });
    },
    bugDetectionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      // Replace the analyzing message with error
      state.messages[state.messages.length - 1] = {
        role: "assistant",
        content: `❌ Bug detection failed: ${action.payload}`,
        timestamp: new Date().toISOString(),
        model: "Bug Detection AI",
        type: "bug-detection",
      };
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
  setInputText,
  clearInitialInput,
  bugDetectionFailure,
  bugDetectionRequest,
  bugDetectionSuccess,
} = chatSlice.actions;

export default chatSlice.reducer;
