import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm here to help you with your coding problem. How can I assist you today?" }] },
        { role: 'user', parts: [{ text: "I need help understanding this problem" }] }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Sorry, I encountered an error. Please try again later." }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg bg-base-100 overflow-hidden">
            <div className="p-4 border-b bg-base-200">
                <h3 className="text-lg font-semibold flex items-center">
                    <Bot className="mr-2" size={20} /> Coding Assistant
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`flex-shrink-0 mt-2 mx-2 ${msg.role === "user" ? "text-primary" : "text-secondary"}`}>
                                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div 
                                className={`px-4 py-3 rounded-lg ${msg.role === "user" 
                                    ? "bg-primary text-primary-content rounded-tr-none" 
                                    : "bg-base-200 text-base-content rounded-tl-none"}`}
                            >
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex max-w-[80%]">
                            <div className="flex-shrink-0 mt-2 mx-2 text-secondary">
                                <Bot size={18} />
                            </div>
                            <div className="px-4 py-3 rounded-lg bg-base-200 text-base-content rounded-tl-none">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center gap-2">
                    <input 
                        placeholder="Type your message here..." 
                        className="input input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-primary" 
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary rounded-full aspect-square p-2"
                        disabled={errors.message || isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>
                {errors.message && (
                    <p className="text-error text-sm mt-1">Message must be at least 2 characters long</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;