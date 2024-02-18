"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useState } from "react";
import { CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useCanRedo, useCanUndo } from "@/liveblocks.config";

interface CanvasProps {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: CanvasProps) => {

const [canvasState, setCanvasState] = useState<CanvasState> ({
    mode: CanvasMode.None,
})

const History = useHistory();
const canUndo = useCanUndo();
const canRedo = useCanRedo();

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
            canvasState={canvasState}
            setCanvasState={setCanvasState}
            canRedo={canRedo}
            canUndo={canUndo}
            undo={History.undo}
            redo={History.redo}

            />
        </main>
    );
};