import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
    secret: "sk_dev_Gnbgw4Y_PPWC5UAJL7VvOkU_sD9eY1PDWo11biZTYhqcrMMPXEWJvaLhDXP00lQc",
});

export async function POST(request: Request) {
    const authorization = await auth();
    const user = await currentUser();


    if(!authorization || !user) {
        return new Response("Unauthorized", {status: 403});
    }

    const { room } = await request.json();
    const board = await convex.query(api.board.get, { id: room });

    if(board?.orgId !== authorization.orgId){
        return new Response("Unauthorized", { status: 403 });
    }

    const userInfo = {
        name: user.firstName || "Teammate",
        picture: user.imageUrl,
    };


    const session = liveblocks.prepareSession(
        user.id,
        { userInfo }
    );

    if(room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    console.log({ status, body }, "Allowed");
    return new Response(body, { status });
};