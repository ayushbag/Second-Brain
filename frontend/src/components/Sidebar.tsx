import { Plus } from 'lucide-react'
import Logo from '/logo.svg'
import SidebarItem from './SidebarItem'


const Sidebar = ({ toggleFunction }: { toggleFunction: (value: boolean) => void }) => {

     

  return (
    <div className='bg-zinc-950/50 w-screen' onClick={() => toggleFunction(false)}>
      <div className="h-screen bg-zinc-900 flex flex-col items-center p-2 w-40 relative">
        <div className="hidden font-mona text-xl pt-3 items-center mb-4 relative">
        <img 
          src={Logo} 
          alt="Logo" 
          className='w-8 pr-1'
        />
        <h1>Memorilink</h1>
        </div>
        <div
          className='p-4 absolute top-0 right-0 rotate-45'
        >
          <Plus 
            size="27"
            onClick={() => toggleFunction(false)}  
          />        
        </div>
        <div className='pt-20 w-full'>
          <SidebarItem />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
