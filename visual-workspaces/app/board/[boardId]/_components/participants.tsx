import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            Lists Of users
        </div>
    );
};

Participants.Skeleton = function ParticipantsSkeleton() {
    return(
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]">
            <Skeleton className="h-full w-full bg-muted-400"/>
        </div>
    )
}