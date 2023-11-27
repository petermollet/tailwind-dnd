import {Column} from "../types/Column.ts";
import {TrashIcon} from "@heroicons/react/24/solid";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";

interface Props {
    column: Column;
    deleteColumn: (id: string) => void;
    setTitle: (title: string) => void;
}

const ColumnContainer = ({ column, deleteColumn, setTitle }: Props) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } =  useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging) {
        return(
            <div
                ref={setNodeRef}
                style={style}
                className="bg-slate-200 w-80 h-[500px] max-h-[500px] rounded-md flex flex-col
                opacity-40 border-2 border-indigo-200"
            />
        )
    }

    return(
        <div
            ref={setNodeRef}
            style={style}
            className="bg-slate-200 w-80 h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            <div
                {...attributes}
                {...listeners}
                className="h-14 flex justify-between items-center bg-slate-100 text-md font-bold cursor-grab rounded-md rounded-b-none px-3 py-1 border-4 border-slate-200"
            >
                <div className="flex items-center gap-2 h-full">
                    <div className="flex justify-center items-center text-sm rounded-full bg-slate-200 px-2 py-1" >
                        0
                    </div>
                    <InputTitle title={column.title} setTitle={setTitle} editMode={editMode} setEditMode={setEditMode} />
                </div>
                <button
                    onClick={() => deleteColumn(column.id)}
                    className="px-1 py-2 text-rose-500 rounded active:text-rose-700 hover:bg-slate-200"
                >
                    <TrashIcon className="h-6 w-6 " />
                </button>
            </div>
            <div className="flex flex-grow">
                content
            </div>
            <div>footer</div>
        </div>
    )
}

export default ColumnContainer;


interface PropsInputTitle {
    title: string;
    setTitle: (title: string) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
}

const InputTitle = ({ title, setTitle, editMode, setEditMode }: PropsInputTitle) => {
    const [value, setValue] = useState<string>(title);

    const content = editMode
    ?  (
        <input
            autoFocus
            className="text-md font-normal outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setEditMode(false)}
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
            className="text-md font-normal outline-none"
        >
            {content}
        </button>
    )
}