import React, { Dispatch, SetStateAction } from "react";
import { ReactElement } from "react";
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import RuleIcon from '@mui/icons-material/Rule';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

export const contractQuestions:QuestionSectionProps[] = [
    {
        icon: <RuleIcon />,
        questions: ["What does this contract do ?", "What is the logical structure of this contract's code ?"],
        title: "Understand Contract Functionalities"
    },
    {
        icon: <DisplaySettingsIcon />,
        questions: ["What are the functions or methods available in this contract ?", "Is this a a NEP-11 contract ?"],
        title: "Use Contract Methods"
    },
    {
        icon: <TipsAndUpdatesOutlinedIcon />,
        questions: ["Design an AMM contract.", "Write me a NEP-17 smart contract."],
        title: "Create Your Own Contract"
    }
]

export const dashboardQuestions:QuestionSectionProps[] = [
    {
        icon: <RuleIcon />,
        questions: ["What does this contract do ?", "What is the logical structure of this contract's code ?"],
        title: "Understand Contract Functionalities"
    },
    {
        icon: <DisplaySettingsIcon />,
        questions: ["What are the functions or methods available in this contract ?", "Is this a a NEP-11 contract ?"],
        title: "Use Contract Methods"
    },
    {
        icon: <TipsAndUpdatesOutlinedIcon />,
        questions: ["Design an AMM contract.", "Write me a NEP-17 smart contract."],
        title: "Create Your Own Contract"
    }
]


export function QuestionOption({ title }: {title: string}) {
    return <div className="bg-gray-50 py-5 px-[10px] w-full mt-5 text-center text-sm font-bold text-gray-400 rounded-lg hover:text-gray-800 hover:border-gray-800 hover:border-[1px] cursor-pointer">
        {title}
    </div>
}

export function Questions({questions, setQuestion}: {questions :QuestionSectionProps[], setQuestion: Dispatch<SetStateAction<string>>}) {
    return  (<div className="flex w-full h-full gap-7 justify-between  mt-[80px]">
        {questions.map(q =>  <QuestionSection title={q.title} questions={q.questions} icon={q.icon} setQuestion={setQuestion}/>)} 
    </div>)
}

export type QuestionSectionProps = {
    title: string;
    questions: string[];
    icon: ReactElement;
}

export type QuestionSectionAllProps = QuestionSectionProps & {
    setQuestion: Dispatch<SetStateAction<string>>
}

export function QuestionSection({ questions, title, icon, setQuestion } : QuestionSectionAllProps) {
    return (
        <div className="flex flex-1 flex-col items-center mt-5">
            <span className="material-icons self-center text-gray-400 mb-3">
                {icon}
            </span>
            <div className="text-gray-600 text-lg">{title}</div>
            {questions.map(q => <div onClick={() => setQuestion(q)}><QuestionOption title={q}/></div>)}
        </div>
    )
}
 