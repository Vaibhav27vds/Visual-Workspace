"use client";

import { UserButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
    const { organization } = useOrganization();
    return(
        <div className="flex items-center gap-x-4 p-5">
            <div className="hidden lg:flex lg:flex-1">
                <SearchInput  />
            </div>
            <div className="block lg:hidden flex-1">
            <OrganizationSwitcher 
            hidePersonal
            appearance={{
                elements: {
                    rootBox:{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "376px",
                    },
                    organizationSwitcherTrigger: {
                        padding: "6px",
                        width:"100%",
                        borderRadius: "8px",
                        border:  "1px solid #E5E7EB",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                    }
                }
            }}
            
            />
            </div>
            {organization && (
            <InviteButton />
            )}
            <ModeToggle />
            <UserButton />
            </div>
    );
};