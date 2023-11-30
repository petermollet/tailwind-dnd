import {Task} from "../types/Task.ts";
import {TrashIcon} from "@heroicons/react/24/solid";
import {useState} from "react";
import DndInputText from "./DndInputText.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: () => void;
    setTitle: (title: string) => void;
}

const TaskCard = ({ task, deleteTask, setTitle } : Props) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } =  useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
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
                className="group relative min-h-[88px] max-h-[88px] px-2 py-1 bg-white rounded-lg mx-2
                hover:cursor-grab hover:ring-2 hover:ring-indigo-500 overflow-y-auto
                opacity-40 border-2 border-indigo-200"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="group relative min-h-[88px] max-h-[88px] px-2 py-1 bg-white rounded-lg mx-2
            hover:cursor-grab hover:ring-2 hover:ring-indigo-500 overflow-y-auto"
        >
            <DndInputText
                title={task.title}
                setTitle={setTitle}
                editMode={editMode}
                setEditMode={setEditMode}
                type="textarea"
            />
            <button
                className="hidden group-hover:block absolute right-1 top-1/2 -translate-y-1/2
                 px-1 py-2 text-rose-500 rounded active:text-rose-700 hover:bg-slate-100"
                onClick={deleteTask}
            >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default TaskCard;
