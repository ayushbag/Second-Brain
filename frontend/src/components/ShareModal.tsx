import axios from "axios"
import { toast } from "react-toastify"

const getShareBrainContent = async () =>  {
  try {
    const res = await axios.get('http://localhost:3000/share', {
      data: {
        
      }
    })
  } catch (error) {
    toast.error("Something went wrong")
  }
}

const ShareModal = ({ toggleShareBrainModal }: {
  toggleShareBrainModal: (s: boolean) => void
}) => {
  return (
    <div className="fixed inset-0 bg-zinc-950/70 flex items-center justify-center h-screen w-screen">
      <div className="bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md font-mona relative">
      <button onClick={() => toggleShareBrainModal(false)} className="absolute top-2 right-2 text-white px-2" aria-label="Close">
        &times;
      </button>
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">Share Brain</h2>
      <div className="flex items-center gap-2">
        <input
        type="text"
        className="rounded-md p-2 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
        placeholder="Enter link"
        />
        <button className="bg-gradient-to-b text-sm from-violet-700 to-purple-600 focus:ring-1 ring-violet-700 text-white rounded-md py-2 px-3">
        Copy
        </button>
      </div>
      </div>
    </div>
  )
}

export default ShareModal