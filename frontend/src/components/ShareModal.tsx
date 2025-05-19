import axios from "axios"
import { useState } from "react";
import { toast } from "react-hot-toast"

const createShareBrainContent = async ({ share }: { share: boolean }) => {
  try {
    const token = localStorage.getItem("Authorization");
    const response = await axios.post(
      'http://localhost:3000/brain/share',
      {
        share
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(share ? "Link Enabled!" : "Link Disabled!");
    return response.data
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  }
}


const ShareModal = ({ toggleShareBrainModal }: {
  toggleShareBrainModal: (s: boolean) => void
}) => {
  const [isShared, setIsShared] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("")

  const handleClick = async () => {
    const res = await createShareBrainContent({ share: !isShared });
    if(res.message == "Link of Brain"){
      setHash(res.hash)
    }
    setIsShared(!isShared)
  }

  return (
    <div className="fixed z-50 inset-0 bg-zinc-950/70 flex items-center justify-center h-screen w-screen">
      <div className="bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md font-mona relative">
        <button onClick={() => toggleShareBrainModal(false)} className="absolute top-2 right-2 text-white px-2" aria-label="Close">
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Share Brain</h2>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              className={`rounded-md p-2 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm pr-12 ${!isShared ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="link"
              value={`http://localhost:5173/brain/${hash}`}
              disabled
              readOnly
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-violet-700 text-white rounded hover:bg-violet-800 transition"
              onClick={() => {
                if (hash) {
                  navigator.clipboard.writeText(`http://localhost:5173/brain/${hash}`);
                  toast.success("Link copied!");
                }
              }}
              disabled={!isShared || !hash}
              aria-label="Copy link"
            >
              Copy
            </button>
          </div>
          <button
            onClick={handleClick}
            className="px-4 bg-gradient-to-b text-sm from-violet-700 to-purple-600 focus:ring-1 ring-violet-700 text-white rounded-md py-2"
          >
            {isShared ? "Disable Share" : "Enable Share"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareModal