import Image from "next/image";

export const EmptyFavourites = () => {
    return(
        <div className="h-full flex flex-col items-center justify-center mt-12">
            <Image  
            src="/empty-favorites.svg"
            height={140}
            width={140}
            alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                No favourite boards! 
            </h2>
            <p className="text-muted-foreground textg-sm mt-2">
                Try favouriting a board
            </p>
        </div>
    )
}