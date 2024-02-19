"use client";

import { nanoid } from "nanoid";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useCallback, useMemo, useState } from "react";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, } from "@/types/canvas";
import { useHistory, useCanRedo, useCanUndo, useMutation, useStorage, useOthersMapped } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds);

const [canvasState, setCanvasState] = useState<CanvasState> ({
    mode: CanvasMode.None,
});

const [ camera, setCamera] = useState<Camera>({ x:0, y:0 });
const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
});

const History = useHistory();
const canUndo = useCanUndo();
const canRedo = useCanRedo();

const insertLayer = useMutation((
    {storage, setMyPresence},
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    position: Point
) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
        return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, {addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
}, [lastUsedColor]);

const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);


const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e, camera);

    setMyPresence({ cursor: current });
}, []);

const onPointerLeave = useMutation((
    { setMyPresence }
) => {
    setMyPresence({ cursor: null });
}, []);

 const onPointerUp = useMutation((
    {},
    e
 ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    console.log({
        point,
        mode: canvasState.mode,
    })

    if (canvasState.mode === CanvasMode.Inserting) { 
        insertLayer(canvasState.layerType, point);

    }

    else{
        setCanvasState({
            mode: CanvasMode.None,
        })
    }
    History.resume();
 }, 
 [
    camera, 
    canvasState,
 ])

 const selections = useOthersMapped((other)  => other.presence.selection);

 const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string,
  ) => {
    if (
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    History.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, 
  [
    setCanvasState,
    camera,
    history,
    canvasState.mode,
  ]);

 const layerIdsToColorSelection = useMemo(() => {

    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections){
        const [connectionID, selection] = user;

        for (const layerId of selection){
            layerIdsToColorSelection[layerId] = connectionIdToColor(connectionID)

        }
     }

     return  layerIdsToColorSelection;

 }, [selections]);


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
            <svg className="h-[100vh] w-[100vw]"
            onWheel={onWheel}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onPointerUp={onPointerUp}

            >

                <g style={{
                    transform: `translate(${camera.x}px, ${camera.y}px)`
                }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview 
                        key={layerId}
                        id={layerId}
                        onLayerPointerDown= {onLayerPointerDown}
                        selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox 
                    onResizeHandlePointerDown= {() => {}}
                    />
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    );
};