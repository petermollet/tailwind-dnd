import {useState} from "react";

interface PropsInputTitle {
    title: string;
    setTitle: (title: string) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    type?: "input" | "textarea";
}

const DndInputTitle = ({ title, setTitle, editMode, setEditMode, type }: PropsInputTitle) => {
    const [value, setValue] = useState<string>(title);

    const InputType = type === "textarea" ? "textarea" : "input";

    const content = editMode
        ?  (
            <InputType
                autoFocus
                className="text-md font-normal outline-none w-full"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => setEditMode(false)}
                rows={type === "textarea" ? 3 : 1}
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        setEditMode(false);
                        setTitle(value);
                    }
                }}
            />
        ) : (
            <>{title}</>
        )

    return(
        <button
            onClick={() => setEditMode(true)}
            className={`text-md font-normal outline-none w-full h-full ${type === 'textarea' && 'flex flex-col items-start justify-start'}`}
        >
            {content}
        </button>
    )
}

export default DndInputTitle;