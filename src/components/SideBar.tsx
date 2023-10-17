import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Alert,
} from "@material-tailwind/react";
import classnames from "classnames";
import {
    ShoppingBagOutlined, DescriptionOutlined, Close
} from "@mui/icons-material";
import React, { ReactElement, SetStateAction, useState } from "react";
import { Images } from "images";
import { allSideMenu, ISideMenu, SideMenu } from "../types";
import { type } from "os";

type SidebarProps = {
    setMenu: React.Dispatch<SetStateAction<ISideMenu>>
}

export function Sidebar({ setMenu }: SidebarProps) {
    const [selectedMenu, setSelectedMenu] = useState<ISideMenu>('dashboard');

    const handleClick = (i: ISideMenu) => {
        setMenu(i)
        setSelectedMenu(i)
    }

    return (
        <Card className="h-full w-full max-w-[20rem] bg-white-100 p-4 shadow-lg shadow-blue-gray-900/25">
            <div className="mb-2 p-4 flex items-center">
                <img src={Images.NeoLogo} alt="brand" className="h-5 w-5 mr-2" />
                <Typography variant="h5" className="text-green-900">
                    Neo Assistant
                </Typography>
            </div>
            <List>
                {allSideMenu.map((s: SideMenu) => {
                    return (<ListItem selected={selectedMenu === s.name} onClick={() => handleClick(s.name)} className={classnames({
                        "!text-green-900": selectedMenu === s.name,
                        "!text-gray-800": selectedMenu !== s.name
                    })}>
                        <ListItemPrefix>
                            {<s.icon className="h-5 w-5" />}
                        </ListItemPrefix>
                        {s.displayName}
                        {s.isComingSoon && <ListItemSuffix>
                            <Chip value="coming soon" size="sm" variant="ghost" color="green" className="rounded-full" />
                        </ListItemSuffix>}
                        {s.name === 'dashboard' && <ListItemSuffix>
                            <Chip value="⚡" size="md" variant="ghost" color="green" className="rounded-full" />
                        </ListItemSuffix>}
                    </ListItem>)
                })}
            </List>
            <div className="flex flex-grow" />
        </Card>
    );
}