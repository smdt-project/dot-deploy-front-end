import { useState, useRef, useEffect } from "react";
import { IoSend, IoClose, IoCopy, IoStopCircle } from "react-icons/io5";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGooglegemini, SiMeta } from "react-icons/si";
import { FaRobot, FaChevronDown } from "react-icons/fa";
import { BsRobot, BsStars } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  clearChat,
  clearInitialInput,
  sendMessageRequest,
  setSelectedModel,
} from "./chatSlice";

const Chat = () => {
  const dispatch = useDispatch();
  const {
    messages,
    isLoading,
    selectedModel,
    models,
    isStreaming,
    initialInput,
  } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [copyNotification, setCopyNotification] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textAreaRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { currLng, currCode } = useSelector((state) => state.project);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    console.log(
      "CHAT COMPONENT: initialInput effect. Current initialInput from props/state:",
      initialInput,
    );
    if (initialInput && initialInput.trim() !== "") {
      console.log(
        "CHAT COMPONENT: initialInput is present, setting local input:",
        initialInput,
      );
      setInput(initialInput);
      dispatch(clearInitialInput());
      if (textAreaRef.current) {
        console.log("CHAT COMPONENT: Focusing textarea and resizing.");
        textAreaRef.current.focus();
        const textarea = textAreaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
      }
    } else if (initialInput === "") {
      console.log(
        "CHAT COMPONENT: initialInput effect. initialInput is empty, doing nothing with local input.",
      );
    }
  }, [initialInput, dispatch]);

  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedMessages([]);
      return;
    }

    // Map messages to displayed format
    const newDisplayedMessages = messages.map((msg) => ({
      ...msg,
      id: msg.timestamp,
      isTyping: false,
    }));

    setDisplayedMessages(newDisplayedMessages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "44px"; // Reset height to calculate scroll height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Create a new AbortController for each request
    abortControllerRef.current = new AbortController();

    dispatch(
      sendMessageRequest({
        selectedModel,
        language: currLng,
        code: currCode,
        question: input,
        signal: abortControllerRef.current.signal,
      }),
    );
    setInput("");
    // Reset textarea height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "44px";
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // dispatch(stopStreaming());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getModelIcon = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    if (!model) return <FaRobot className="text-blue-400" />;

    switch (model.icon) {
      case "SiGooglegemini":
        return <SiGooglegemini className="text-blue-400" />;
      case "FaRobot":
        return <FaRobot className="text-blue-400" />;
      case "BsRobot":
        return <BsRobot className="text-blue-400" />;
      case "SiMeta":
        return <SiMeta className="text-blue-400" />;
      case "BsStars":
        return <BsStars className="text-blue-400" />;
      case "TbBrandOpenai":
        return <TbBrandOpenai className="text-blue-400" />;
      //case "SiMicrosoft":
      //  return <SiMicrosoft className="text-blue-400" />;
      default:
        return <FaRobot className="text-blue-400" />;
    }
  };

  const getModelName = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    return model ? model.name : "Unknown Model";
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  const handleModelChange = (modelId) => {
    dispatch(setSelectedModel(modelId));
    setIsModelDropdownOpen(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyNotification("Code copied to clipboard!");
        setTimeout(() => setCopyNotification(null), 2000);
      })
      .catch((err) => {
        setCopyNotification("Failed to copy code!");
        setTimeout(() => setCopyNotification(null), 2000);
      });
  };

  return (
    <div className="flex flex-col h-full text-slate-300 border-l border-slate-700  custom-scrollbar">
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3a3a3a #1a1a1a;
        }

        /* Hide textarea scrollbar but keep functionality */
        .input-textarea {
          scrollbar-width: none;
        }

        .input-textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header with model selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700  sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-white">AI Assistant</div>
          <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            {currLng}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-700/50"
            title="Clear chat"
          >
            <IoClose size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3e3e3e] transition-colors border border-slate-700"
            >
              <span className="flex items-center gap-1.5">
                {getModelIcon(selectedModel)}
                <span className="text-slate-200">
                  {getModelName(selectedModel)}
                </span>
              </span>
              <FaChevronDown size={10} className="text-slate-400" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-[#252526] border border-slate-700 rounded-md shadow-lg z-10 overflow-hidden custom-scrollbar">
                <div className="py-1">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-xs hover:bg-[#3e3e3e] transition-colors ${
                        selectedModel === model.id ? "bg-[#3e3e3e]" : ""
                      }`}
                      onClick={() => handleModelChange(model.id)}
                    >
                      <span className="text-blue-400">
                        {getModelIcon(model.id)}
                      </span>
                      <span className="text-slate-200">{model.name}</span>
                      {selectedModel === model.id && (
                        <span className="ml-auto text-blue-400 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a] custom-scrollbar">
        {displayedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-[#2d2d2d] p-5 rounded-full mb-4 border border-slate-700/50">
              <BsStars size={28} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              How can I help you today?
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              Ask questions about your {currLng} code, request explanations, or
              get help with debugging.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
              <div className="bg-[#2d2d2d] p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/30 cursor-pointer transition-colors">
                <p className="text-xs text-slate-400 mb-1">Example 1</p>
                <p className="text-sm text-white">Explain this code</p>
              </div>
              <div className="bg-[#2d2d2d] p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/30 cursor-pointer transition-colors">
                <p className="text-xs text-slate-400 mb-1">Example 2</p>
                <p className="text-sm text-white">How can I optimize this?</p>
              </div>
            </div>
          </div>
        ) : (
          displayedMessages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2d2d2d] flex items-center justify-center border border-slate-700/50">
                  {getModelIcon(message.model)}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg ${
                  message.role === "user"
                    ? "bg-[#2b5797] text-white"
                    : "bg-[#2d2d2d] border border-slate-700/50"
                }`}
              >
                <div className="p-4">
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            if (!inline && match) {
                              return (
                                <div className="relative">
                                  <div className="absolute right-0 top-0 flex gap-1 p-2">
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          String(children).replace(/\n$/, ""),
                                        )
                                      }
                                      className="p-1.5 rounded bg-[#3a3a3a]/80 hover:bg-[#4a4a4a] transition-colors text-slate-300 hover:text-white"
                                      title="Copy code"
                                    >
                                      <IoCopy size={14} />
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                      margin: 0,
                                      padding: "1rem",
                                      background: "#1e1e1e",
                                      borderRadius: "0.375rem",
                                    }}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }
                            return (
                              <code
                                className={className}
                                style={{
                                  background: "#3a3a3a",
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: "0.25rem",
                                }}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
                <div
                  className={`px-4 pb-2 pt-1 text-xs ${
                    message.role === "user"
                      ? "text-blue-200/70"
                      : "text-slate-500"
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2d2d2d] flex items-center justify-center border border-slate-700/50 overflow-hidden">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2d2d2d] flex items-center justify-center border border-slate-700/50">
              {getModelIcon(selectedModel)}
            </div>
            <div className="max-w-[85%] rounded-lg p-4 bg-[#2d2d2d] border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-300"></div>
                </div>
                {isStreaming && (
                  <button
                    onClick={handleStopGeneration}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors ml-4"
                  >
                    <IoStopCircle size={16} />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Copy notification */}
      {copyNotification && (
        <div className="fixed bottom-16 left-4 flex items-center gap-2 bg-blue-500/80 text-white px-3 py-2 rounded-md shadow-lg transition-opacity duration-300 z-20">
          <IoCopy size={14} />
          {copyNotification}
        </div>
      )}

      {/* Enhanced Input area */}
      <div className="p-4 border-t border-slate-700 bg-[#252526] sticky bottom-0">
        <div className="relative flex items-end rounded-lg bg-[#1e1e1e] border border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500">
          <textarea
            ref={(el) => {
              inputRef.current = el;
              textAreaRef.current = el;
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${getModelName(
              selectedModel,
            )} about your ${currLng} code...`}
            className="w-full px-4 py-3 pr-12 bg-transparent border-none focus:outline-none text-slate-300 resize-none input-textarea overflow-y-auto"
            style={{
              minHeight: "44px",
              maxHeight: "150px",
              lineHeight: "1.5",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === "" || isLoading}
            className={`absolute right-3 bottom-3 p-1.5 rounded-md ${
              input.trim() === "" || isLoading
                ? "text-slate-600 bg-slate-700/30 cursor-not-allowed"
                : "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors"
            }`}
          >
            <IoSend size={16} />
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between px-1">
          <span>Shift+Enter for new line</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
