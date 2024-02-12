"use client"

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { create } from "domain";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";


interface BoardCardProps {
    id: string;
    title:string;
    authorId:string;
    authorName:string;
    createdAt:number;
    imageUrl:string;
    orgId:string;
    isFavourite: boolean;
}

export const BoardCard = ({
    id,
    title,
    authorId,
    authorName,
    createdAt,
    imageUrl,
    orgId,
    isFavourite,
}: BoardCardProps) => {
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true,
    });


    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image  
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-fit"
                    />
                    <Overlay />
                </div>
                <Footer 
                isFavourite={isFavourite}
                title={title}
                authorLabel={authorLabel}
                createdAtLabel={createdAtLabel}
                onClick={() => {}}
                disabled={false}
                /> 
            </div>
        </Link>
    );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />

        </div>
    );
};