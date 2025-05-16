import { Link2, Plus } from "lucide-react"
import Logo from '../icons/MainLogo'
import Button from "./Button"

const Navbar = ({addContentModal, shareBrainModal}:{
  addContentModal: (s: boolean) => void
  shareBrainModal: (s: boolean) => void
}) => {

  return (
    <div className="p-2 md:p-4 justify-between inline-flex leading-tight items-center">
        <div className="pl-2">
            <Logo size="26" color="#FFD1E3" />
        </div>
        <div className="flex gap-0.5">
            <Button 
              onClick={() => addContentModal(true)}
              startIcon={<Plus size="18"/>} 
              size="small" 
            />
            <Button 
              onClick={() => shareBrainModal(true)}
              startIcon={<Link2 size="17"/>} 
              size="small" 
              intent="secondary" 
            />
        </div>
    </div>
  )
}

export default Navbar