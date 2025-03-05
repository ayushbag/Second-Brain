import { BrainIcon } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { ContentTypes } from "../pages/Main";

const SidebarLarge = ({
  activated, setFilterContent
}: {
  activated: ContentTypes;
  setFilterContent: (data: any) => void
}) => {
  return (
    <>
      <div className="hidden lg:flex lg:flex-col justify-center items-start">
        <div className="p-[5vh] text-2xl flex items-center gap-2 pt-10">
          <div className="text-violet-600">
            <BrainIcon />
          </div>
          <h1>Memorilink</h1>
        </div>
        <div className="px-7 pt-5 w-full gap-2 text-zinc-300">
            <SidebarItem activated={activated} setFilterContent={setFilterContent} />
        </div>
      </div>
    </>
  );
};

export default SidebarLarge;
