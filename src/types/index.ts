import { ReactComponentElement, ReactElement } from "react";
import {
    SpaceDashboardOutlined, DocumentScanner, Build
} from "@mui/icons-material";

export type ISideMenu ="dashboard" | "scan" | "chatbot"

export type SideMenu = {
    name: ISideMenu;
    displayName: string
    icon: any;
    isComingSoon: boolean;
}

export const allSideMenu: SideMenu[] = [
    {
        name: "dashboard",
        displayName: "Chat with NeoAI",
        icon: SpaceDashboardOutlined,
        isComingSoon: false
    },
    {
        name: "scan",
        displayName: "Scan Smart Contracts",
        icon: DocumentScanner,
        isComingSoon: false
    },
    {
        name: "chatbot",
        displayName: "Build Assistant for your Dapp",
        icon: Build,
        isComingSoon: false
    }
]