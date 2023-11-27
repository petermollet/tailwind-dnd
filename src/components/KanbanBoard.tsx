import {useMemo, useState} from "react";
import {Column} from "../types/Column.ts";
import {generateId} from "../types/typeUtils.ts";
import ColumnContainer from "./ColumnContainer.tsx";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import {createPortal} from "react-dom";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const columnsId = useMemo(() => {
        return columns.map((col) => col.id);
    }, [columns]);

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
        setColumns(() => {
            return columns.filter((col) => col.id !== id);
        });
    }

    const handleDragStart = (event: DragStartEvent) => {
        if(event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        }
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if(!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;
        if(activeColumnId === overColumnId) return;
        setColumns((columns) => {
            const overIndex = columns.findIndex((col) => col.id === overColumnId);
            const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
            const newColumns = [...columns];
            newColumns.splice(overIndex, 0, newColumns.splice(activeIndex, 1)[0]);
            return newColumns;
        });
        setActiveColumn(null);
    }

    const handleChangeColumnTitle = (id: string, title: string) => {
        setColumns((columns) => {
            const columnIndex = columns.findIndex((col) => col.id === id);
            const newColumns = [...columns];
            newColumns[columnIndex].title = title;
            return newColumns;
        });
    }

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    }))

    return (
        <div className="flex w-full items-center overflow-x-auto overflow-y-hidden">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="m-auto flex gap-4 min-h-[500px]">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    setTitle={(value) => handleChangeColumnTitle(col.id, value)}
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