import { useState, useEffect, KeyboardEvent, useRef } from "react";
import React from "react";
import hljs from "highlight.js";
import { Renderer, marked } from "marked";
import htmlBeautify from "html-beautify";
import { Carousel } from "@material-tailwind/react";
import { GptMessage } from "./GptMessage";

type AIAnswer = {
    answer: string | null,
    source_documents: string[] | null
}

type Question = {
    question: string
}

type Message = AIAnswer & Question

const parser = (text: string) => {
    let renderer = new Renderer();
    renderer.paragraph = (text) => {
        return text.replace(/(?:\r\n|\r|\n)/g, "<br>") + "\n";
    };
    renderer.list = (text) => {
        return `${text.replace(/(?:\r\n|\r|\n)/g, "<br>")}\n\n`;
    };
    renderer.listitem = (text) => {
        return `\n• ${text.replace(/(?:\r\n|\r|\n)/g, "<br>")}`;
    };
    renderer.code = (code, language) => {
        const validLanguage = hljs.getLanguage(language || "")
            ? language
            : "plaintext";
        const highlightedCode = hljs.highlight(
            validLanguage || "plaintext",
            code
        ).value;
        return `<pre class="highlight bg-gray-700" style="padding: 5px; border-radius: 5px; overflow: auto; overflow-wrap: anywhere; white-space: pre-wrap; max-width: 100%; display: block; line-height: 1.2"><code class="${language}" style="color: #d6e2ef; font-size: 12px; ">${highlightedCode}</code></pre>`;
    };
    marked.setOptions({ renderer });
    return marked(text);
}

const ChatGPTResponseFormatter = (response: string) => {
    const parsedResponse = parser(response);
    const beautifiedResponse = htmlBeautify(parsedResponse);

    return (
        <div dangerouslySetInnerHTML={{ __html: parsedResponse }} />
    );
};

function Dashboard() {
    const [prompt, updatePrompt] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([])
    const inputRef = useRef(null);
    const [demoQuestion, setDemoQuestion] = useState<string>();
    const currentQuesRef = useRef(null);

    useEffect(() => {
        // Auto-focus the input element when the component mounts
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        // if answer in last message is not null, set inputRef in focus
        if (messages.length && messages[messages.length - 1]?.answer && inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages]);

    const handleKeySubmit = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        await handleSubmit();
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const chatHistory = messages.map(m => [m.question, m.answer]);
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: prompt, chat_history: chatHistory }),
            };

            setMessages([...messages, { question: prompt, answer: null, source_documents: null }])
            updatePrompt("")

            const res = await fetch("https://127.0.0.1:5000/chat", requestOptions);

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            const message = await res.json();
            console.log("message", message);
            // update the answer and source documents in last message
            setMessages(messages => {
                const newMessages = [...messages];
                newMessages[messages.length - 1].answer = message?.answer;
                newMessages[messages.length - 1].source_documents = message?.source_documents;
                return newMessages;
            })

        } catch (err) {
            console.error(err, "err");
        } finally {
            setLoading(false);
        }
    };


    const handleClearMessage = () => {
        setMessages([])
    }

    
    return (
        <div className="flex flex-col rounded-2xl w-full bg-white h-full shadow-lg bg-white-100 shadow-blue-gray-900/25">
            <GptMessage messages={messages} setQuestion={setDemoQuestion}/>
                <div className="w-full flex flex-col items-end self-end bottom-0 bg-white p-7">
                    <input
                        type="text"
                        ref={inputRef}
                        className="block w-[100%] border-[1px] rounded-lg outline-none text-base text-black p-3 bg-white bg-left-center bg-no-repeat bg-3.5% focus:border-[1px] focus:border-green-900"
                        placeholder="Ask me anything about Neo"
                        disabled={loading}
                        value={prompt}
                        onChange={(e) => updatePrompt(e.target.value)}
                        onKeyDown={(e) => handleKeySubmit(e)}
                    />
                    {(messages.length !== 0) && <div onClick={handleClearMessage} className="text-[12px] py-2 text-gray-400 hover:text-gray-700 hover:font-black cursor-pointer">🗑️<span className="hover:underline"> Clear Previous Messages</span></div >}
                </div>
        </div>
    );
}


export default Dashboard;
