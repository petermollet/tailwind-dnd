import {Column} from "../types/Column.ts";
import {TrashIcon} from "@heroicons/react/24/solid";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useMemo, useState} from "react";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import DndInputTitle from "./DndInputText.tsx";
import {Task} from "../types/Task.ts";
import TaskCard from "./TaskCard.tsx";

interface Props {
    column: Column;
    deleteColumn: (id: string) => void;
    setTitle: (title: string) => void;
    tasks: Task[];
    createTask: (id: string) => void;
    deleteTask: (id: string) => void;
    changeTaskTitle: (id: string, title: string) => void;
}

const ColumnContainer = ({ column, deleteColumn, setTitle, createTask, tasks, deleteTask, changeTaskTitle }: Props) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

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
                className="h-14 flex justify-between items-center px-3 py-1 text-md font-bold
                bg-slate-100 border-4 border-slate-200 cursor-grab rounded-md rounded-b-none "
            >
                <div className="flex items-center gap-2 h-full">
                    <div className="flex justify-center items-center text-sm rounded-full bg-slate-200 px-2 py-1" >
                        0
                    </div>
                    <DndInputTitle title={column.title} setTitle={setTitle} editMode={editMode} setEditMode={setEditMode} />
                </div>
                <button
                    onClick={() => deleteColumn(column.id)}
                    className="px-1 py-2 text-rose-500 rounded active:text-rose-700 hover:bg-slate-200"
                >
                    <TrashIcon className="h-6 w-6 " />
                </button>
            </div>

            <div className="pt-1 flex flex-grow overflow-y-auto">
                <div className="w-full flex flex-col gap-3">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task) => (
                            <TaskCard
                                task={task}
                                deleteTask={() => deleteTask(task.id)}
                                setTitle={(value) => changeTaskTitle(task.id, value)}
                                key={task.id}
                            />
                        ))}
                    </SortableContext>
                </div>
            </div>

            <button
                className="flex items-center gap-2 h-14 w-full p-4 rounded-lg rounded-t-none
                border-4 border-slate-200 focus:outline-none active:bg-slate-100 hover:text-indigo-500"
                onClick={() => createTask(column.id)}
            >
                <PlusCircleIcon className="h-6 w-6" />
                Add task
            </button>
        </div>
    )
}

export default ColumnContainer;
