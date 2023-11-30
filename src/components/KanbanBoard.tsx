import {useMemo, useState} from "react";
import {Column} from "../types/Column.ts";
import {generateId} from "../types/typeUtils.ts";
import ColumnContainer from "./ColumnContainer.tsx";
import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import {createPortal} from "react-dom";
import {Task} from "../types/Task.ts";
import TaskCard from "./TaskCard.tsx";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const columnsId = useMemo(() => {
        return columns.map((col) => col.id);
    }, [columns]);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    }));

    const addColumn = () => {
        setColumns(() => {
            const newColumn = {
                id: generateId(),
                title: `Column ${columns.length + 1}`,
            };

            return [...columns, newColumn];
        });
    };

    const deleteColumn = (id: string) => {
        setColumns((columns) => {
            return columns.filter((col) => col.id !== id);
        });
        setTasks((tasks) => {
            return tasks.filter((task) => task.columnId !== id);
        })
    };

    const handleDragStart = (event: DragStartEvent) => {
        if(event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        } else if(event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current?.task);
        }
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTask(null);

        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;
        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if(!over) return;
        const activeId = active.id;
        const overId = over.id;
        if(activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        if(!isActiveATask) return;

        if(isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((task) => task.id === activeId);
                const overIndex = tasks.findIndex((task) => task.id === overId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId;
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }
        const isOverAColumn = over.data.current?.type === "Column";
        if (isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((task) => task.id === activeId);
                const overIndex = columns.findIndex((col) => col.id === overId);
                tasks[activeIndex].columnId = columns[overIndex].id;
                return tasks;
            });
        }

    }

    const handleChangeColumnTitle = (id: string, title: string) => {
        setColumns((columns) => {
            const columnIndex = columns.findIndex((col) => col.id === id);
            const newColumns = [...columns];
            newColumns[columnIndex].title = title;
            return newColumns;
        });
    };

    const createTask = (id: string) => {
        const newTask: Task = {
            id: generateId(),
            title: `Task ${tasks.length + 1}`,
            columnId: id
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id: string) => {
        setTasks(() => {
            return tasks.filter((task) => task.id !== id);
        });
    }

    const changeTaskTitle = (id: string, title: string) => {
        setTasks((tasks) => {
            const taskIndex = tasks.findIndex((task) => task.id === id);
            const newTasks = [...tasks];
            newTasks[taskIndex].title = title;
            return newTasks;
        });
    }

    return (
        <div className="flex w-full overflow-x-auto overflow-y-hidden">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div className="mx-auto mt-20 px-10 flex gap-4 min-h-[500px]">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    setTitle={(value) => handleChangeColumnTitle(col.id, value)}
                                    createTask={createTask}
                                    tasks={tasks.filter((task) => task.columnId === col.id)}
                                    deleteTask={deleteTask}
                                    changeTaskTitle={changeTaskTitle}
                                    key={col.id}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        className="flex gap-2 h-14 w-80 min-w-[320px] p-4 rounded-lg bg-slate-200 ring-indigo-500 border border-gray-300
                        hover:ring-2 focus:outline-none"
                        onClick={addColumn}
                    >
                        <PlusCircleIcon className="h-6 w-6 text-gray-500" />
                        Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={() => {}}
                                setTitle={() => {}}
                                createTask={() => {}}
                                deleteTask={() => {}}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                changeTaskTitle={() => {}}
                            />
                        )}
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                deleteTask={() => {}}
                                setTitle={() => {}}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default KanbanBoard;