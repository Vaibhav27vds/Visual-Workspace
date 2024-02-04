"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";

interface ConvexClientProviderProps {
    children: React.ReactNode;
};

const converxUrl  = process.env.NEXT_PUBLIC_CONVERX_URL!;

const convex = new ConvexReactClient(converxUrl);

export const  ConvexClientProvider = ({
    children, 
}:  ConvexClientProviderProps) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>

    );
};

