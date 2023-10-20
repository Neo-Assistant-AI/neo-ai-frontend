import {
    Dispatch,
    SetStateAction,
    useRef,
} from "react";
import React from "react";
import {
    IconButton,
    Tooltip,
} from "@mui/material";
import hljs from "highlight.js";
import { Renderer, marked } from "marked";
import htmlBeautify from "html-beautify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { Images } from "images";
import {
    Carousel,
} from "@material-tailwind/react";
import { Questions, contractQuestions } from "./Quesitons";
import BouncingDotsLoader from "./BouncingDotsLoader";
import { useChatScroll } from "hooks/useChatScroll";

export type GptMessageProps = {
    messages: Message[];
    setQuestion: Dispatch<SetStateAction<string>>
};

export type AIAnswer = {
    answer: string | null;
    source_documents: string[] | null;
};

export type Question = {
    question: string;
};

export type Message = AIAnswer & Question;

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
};

const ChatGPTResponseFormatter = (response: string) => {
    const parsedResponse = parser(response);
    const beautifiedResponse = htmlBeautify(parsedResponse);

    return <div dangerouslySetInnerHTML={{ __html: parsedResponse }} />;
};

export function GptMessage({ messages, setQuestion }: GptMessageProps) {
    const ref = useChatScroll(messages)
    return (
        <>
            {messages.length === 0 && (
                <div className="w-full flex p-7">
                    <img src={Images.NeoLogo} alt="" className="h-10 w-10 mr-5 mt-1" />
                    <div className="flex flex-col w-full bg-gray-50 p-6 rounded-b-2xl rounded-r-2xl">
                        <div>
                            <span className="text-base text-gray-400">Hi, there.</span>
                            <span className="ml-1 wave h-5">👋</span>
                        </div>
                        <CarouselTitle />
                    </div>
                </div>
            )}

            <div ref={ref} className="h-full  overflow-y-scroll flex flex-col text-base items-center px-8 pt-4 pb-20">
                {messages &&
                    messages.map((msg, i) => {
                        return (
                            <div key={i} className="flex flex-col w-full justify-start py-2">
                                <div className=" p-5 rounded-b-2xl rounded-tr-2xl bg-green-50">
                                    {msg.question}
                                </div>
                                {msg.answer ? (
                                    <div className="bg-gray-50 p-5 rounded-b-2xl rounded-tl-2xl mt-5">
                                        <div className="py-2 text-gray-800">
                                            {ChatGPTResponseFormatter(msg.answer)}
                                        </div>
                                        {msg.source_documents && (
                                            <div className="flex items-center gap-2 my-3 text-sm">
                                                <div className="font-black">Read More:</div>
                                                {msg.source_documents.map((s, ii) => {
                                                    return (
                                                        <Tooltip
                                                            key={"source-doc-" + i.toString() + ii.toString()}
                                                            title={s}
                                                        >
                                                            <a
                                                                href={s}
                                                                target="_blank"
                                                                className="px-2 py-1 hover:underline cursor-pointer no-underline text-black bg-gray-50 border-[1px] border-gray-200 rounded hover:bg-gray-100 hover:border-gray-400"
                                                            >
                                                                {s.split("/")[s.split("/").length - 1]}
                                                            </a>
                                                        </Tooltip>
                                                    );
                                                })}
                                                <div className="self-end">
                                                    <IconButton
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(msg.answer);
                                                        }}
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <GptLoader />
                                )}
                            </div>
                        );
                    })}
                {messages.length === 0 && <Questions questions={contractQuestions} setQuestion={setQuestion}/>}
            </div>
        </>
    );
}

function CarouselTitle() {
    return (
        <Carousel
            className="rounded-xl"
            prevArrow={({ handlePrev }) => { }}
            nextArrow={({ handleNext }) => { }}
            autoplay={true}
            loop={true}
            dir="vertical"
        >
            <div className="text-black-100 font-bold text-2xl pt-2">
                I'm NeoAI Assistant
            </div>
            <div className="text-black-100 font-bold text-2xl pt-2">
                I Can help you with the following scenarios:
            </div>
            <div className="text-black-100 font-bold text-2xl pt-2">
                Don't forget to add relevant contracts 👉
            </div>
        </Carousel>
    );
}

function GptLoader() {
    return (
        <div className="div flex">
            <div className="flex flex-grow" />
            <div className="bg-gray-50 p-5 rounded-b-2xl rounded-tl-2xl mt-5">
                <BouncingDotsLoader />
            </div>
        </div>
    );
}
