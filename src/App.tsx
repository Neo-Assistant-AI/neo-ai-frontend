import { useState } from "react";
import React from "react";
import { Sidebar } from "components/SideBar";
import { ISideMenu } from "types";
import Contract from "components/Contract";
import ComingSoon from "components/ComingSoon";

function App() {
  const [selectedMenu, setSelectedMenu] = useState<ISideMenu>('dashboard')
  return (<div className="w-screen h-screen flex p-7 gap-x-7 ">
    <Sidebar setMenu={setSelectedMenu} />
    { selectedMenu === 'dashboard' && <Contract />}
    { selectedMenu !== 'dashboard' && <ComingSoon />}
  </div>)
}

export default App;
