"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";

 
interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void; // Fix types
    selectionColor?: string;
};


export const LayerPreview = memo(({
    id,
    onLayerPointerDown,
    selectionColor

}: LayerPreviewProps) => {

const layer = useStorage((root) => root.layers.get(id));

console.log({
    layer
},"LayerPreview")

if(!layer) {
    return null;
}

switch (layer.type){
    case LayerType.Rectangle:
        return (
             <Rectangle
             id={id}
             layer={layer}
             onPointerDown={onLayerPointerDown}
             selectionColor="selectionColor"
             />

        );

        default: 
        console.warn("Unknown layer type");
        return null;
}
});

LayerPreview.displayName = "LayerPreview";