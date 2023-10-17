import { useState, useEffect, KeyboardEvent, useRef } from "react";
import React from "react";
import { AddContracts, addedContractState } from "./AddContracts";
import { GptMessage, Message } from "./GptMessage";
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Typography } from "@mui/material";

const contractMessageState = atom<Message[]>({
    key: 'contractMessageState',
    default: [],
});

function Contract() {
    const [prompt, updatePrompt] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useRecoilState<Message[]>(contractMessageState);
    const [demoQuestion, setDemoQuestion] = useState<string>();
    const uploadedContracts = useRecoilValue(addedContractState);

    useEffect(()=>{updatePrompt(demoQuestion)}, [demoQuestion])

    const inputRef = useRef(null);

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

            // TODO: USE THIS
            const contractCode = uploadedContracts[0]?.code

            setMessages([...messages, { question: prompt, answer: null, source_documents: null }])
            updatePrompt("")

            const res = await fetch("http://ec2-13-50-120-190.eu-north-1.compute.amazonaws.com/chat", requestOptions);

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            const message = await res.json();
            console.log("message", message);
            // update the answer and source documents in last message
            setMessages(messages => {
                const newMessages = [...messages];
                newMessages[messages.length - 1] = { question: prompt, answer: message?.answer, source_documents: message?.source_documents }
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
        <>
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
            <AddContracts />
        </>
    );
}



export default Contract;
