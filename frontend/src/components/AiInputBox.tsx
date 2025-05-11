import { ArrowUp } from "lucide-react";

const AiInputBox = () => {
  return (
    <div className="w-full font-mona max-w-72  md:max-w-3xl mx-auto px-4 py-3 rounded-3xl border border-gray-600 bg-zinc-900 flex flex-col items-center gap-2 shadow-md">
      <textarea
        placeholder="Type to recall a memory..."
        className="w-full p-2 bg-transparent focus:outline-none text-white text-sm placeholder-gray-400 placeholder:text-md resize-none overflow-hidden mb-2"
        rows={2}
      />
      <div className="w-full flex items-center justify-end gap-2">
        <div className="relative inline-block w-32">
            <select
            title="All Memories"
            className="appearance-none tracking-wide px-3 py-2 border border-zinc-600 text-white text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 transition w-full pr-8 focus:outline-none focus:ring-0.5 focus:ring-zinc-500 focus:border-zinc-500"
            >
            <option value="All">All Memories</option>
            <option value="youtube">Youtube</option>
            <option value="tweets">Tweets</option>
            <option value="link">Links</option>
            </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button title="send" className="flex items-center justify-center text-2xl w-9 h-9 border border-zinc-100 text-black rounded-full hover:bg-zinc-300 bg-gray-200 transition leading-tight">
          <ArrowUp size="20" />
        </button>
      </div>
    </div>

  )
}

export default AiInputBox