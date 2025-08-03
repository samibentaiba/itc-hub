"use client";

import { Provider } from "@/components/provider";
import type React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
    <Provider>
        {children}
    </Provider>
    </>;
} 