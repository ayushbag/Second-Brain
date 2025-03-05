import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const Landing = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className='max-w-3xl mx-auto bg-zinc-950'>
        <div className='flex flex-col gap-8 justify-center min-h-screen items-center text-white '>
          <div className='text-6xl font-dmSans font-bold text-center bg-gradient-to-b from-zinc-500 via-white to-white text-transparent bg-clip-text'>It always seems impossible <br /> until it's done.</div>
          <div className='text-lg font-mona font-light text-center'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione tempora minima animi. Atque, voluptates, laborum dolorem quod exercitationem consectetur est qui excepturi labore animi voluptate.</div>
          <button className='text-md font-mona bg-gradient-to-b from-violet-700 to-purple-600 px-4 py-2 rounded-lg items-center text-white border border-violet-900' 
            onClick={() => navigate("/login")}
          >Get Started</button>
        </div>
      </div>
    </>
  )
}

export default Landing