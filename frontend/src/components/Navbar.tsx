import { Link2, Menu, Plus } from "lucide-react"
import Logo from '../icons/MainLogo'
import Button from "./Button"

const Navbar = ({ toggleFunction, toggleAddContentModal, toggleShareBrain } : {
  toggleFunction: (value: boolean) => void ,
  toggleAddContentModal: (value: boolean) => void ,
  toggleShareBrain: (value: boolean) => void ,
}) => {

  return (
    <div className="p-1 bg-zinc-900/50 backdrop-blur-md lg:backdrop-blur-lg border-b-[1px] font-mona border-zinc-900 flex items-center justify-between lg:border-none lg:p-6 lg:bg-zinc-950 ">
        <div 
            className="text-zinc-300 p-4 mr-3 lg:hidden"
            onClick={() => toggleFunction(true)}
        >
            <Menu />
        </div>
        <div className="text-violet-600 lg:hidden">
            <Logo size='30' color="#7c3aed"/>
        </div>
        <div className="text-center flex items-center lg:hidden justify-between gap-1">
            <Button onClick={() => toggleAddContentModal(true)} intent="primary" startIcon={<Plus size="20" />}  size="small"/>
            <Button intent="secondary" startIcon={<Link2 size="20" />} size="small"/>
        </div>

        {/* lg */}
        <div className="hidden lg:text-2xl lg:block text-zinc-100 pl-10 font-mona">
            All Notes
        </div>
        <div className="hidden text-center lg:flex items-center justify-between gap-1">
            <Button onClick={() => toggleAddContentModal(true)} intent="primary" startIcon={<Plus size="20" />} size="medium">&nbsp;Add Contents</Button>
            <Button onClick={() => toggleShareBrain(true)} intent="secondary" startIcon={<Link2 size="20" />} size="medium">&nbsp;Share Brain</Button>
        </div>
    </div>
  )
}

export default Navbar