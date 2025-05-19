import { useState, useRef, useEffect } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGooglegemini, SiMeta } from "react-icons/si";
import { FaRobot, FaChevronDown } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude-3.7");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const models = [
    { id: "claude-3.7", name: "Claude 3.7", icon: <TbBrandOpenai /> },
    { id: "gemini-pro", name: "Gemini Pro", icon: <SiGooglegemini /> },
    { id: "deepseek", name: "DeepSeek", icon: <FaRobot /> },
    { id: "llama-3", name: "Llama 3", icon: <SiMeta /> },
    { id: "mistral", name: "Mistral", icon: <BsStars /> },
    { id: "phi-3", name: "Phi-3", icon: <FaRobot /> },
    { id: "qwen", name: "Qwen", icon: <FaRobot /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call to selected model
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant",
        content: `This is a simulated response from the ${
          models.find((m) => m.id === selectedModel).name
        } model. In a real implementation, this would be an actual response from the API.
        
\`\`\`javascript
// Example code response
function exampleFunction() {
  console.log("This is an example response");
  return true;
}
\`\`\``,
        timestamp: new Date().toISOString(),
        model: selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
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
    return model ? model.icon : <FaRobot />;
  };

  const getModelName = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    return model ? model.name : "Unknown Model";
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full  text-slate-300 border-l border-slate-700">
      {/* Header with model selector */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#252526]">
        <div className="text-sm font-medium">AI Assistant</div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear chat"
          >
            <IoClose size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3e3e3e] transition-colors"
            >
              <span className="flex items-center gap-1">
                {getModelIcon(selectedModel)}
                <span>{getModelName(selectedModel)}</span>
              </span>
              <FaChevronDown size={10} />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#252526] border border-slate-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-xs hover:bg-[#3e3e3e] transition-colors ${
                        selectedModel === model.id ? "bg-[#3e3e3e]" : ""
                      }`}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                    >
                      <span className="text-slate-300">{model.icon}</span>
                      <span>{model.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
            <BsStars size={24} className="mb-2" />
            <p>Ask a question about your code</p>
            <p className="text-xs mt-1">
              Select a model from the dropdown above
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center text-blue-400">
                  {getModelIcon(message.model)}
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-[#2b5797] text-white"
                    : "bg-[#2d2d2d] text-slate-300"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
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
                <div className="text-right text-xs mt-1 text-slate-500">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center text-blue-400">
              {getModelIcon(selectedModel)}
            </div>
            <div className="max-w-[80%] rounded-lg p-3 bg-[#2d2d2d]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-700 bg-[#252526]">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code..."
            className="w-full px-4 py-2 pr-10 bg-[#1e1e1e] border border-slate-700 rounded-md focus:outline-none focus:border-blue-500 text-slate-300 resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === "" || isLoading}
            className={`absolute right-3 bottom-7 text-slate-400 ${
              input.trim() === "" || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500 cursor-pointer"
            }`}
          >
            <IoSend size={16} />
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>Shift + Enter for new line</span>
          <span>Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
