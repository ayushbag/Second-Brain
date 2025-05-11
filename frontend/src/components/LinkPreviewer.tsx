import axios from "axios"
import { useEffect, useState } from "react"

interface LinkPreviewerProps{
    url: string
}

interface LinkPreviewData {
  image: string;
  title: string;
  description: string;
}

const LinkPreviewer = ({ url }: LinkPreviewerProps) => {

  const [data, setData] = useState<LinkPreviewData | null>(null)

  useEffect(() => {
    const fetchLinkPreview = async () => {
      try {
      const response = await axios.post("http://localhost:3000/link-preview", { url });
      const previewData = response.data.data;
      console.log(previewData);
      setData(previewData);
      } catch (error) {
      console.error(error);
      }
    };

    fetchLinkPreview();
    console.log("Data: ", data)
  }, [url])

  return (
    <div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-64 h-64+[20px] flex flex-col backdrop-blur-md rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700 shadow-sm hover:shadow-black hover:scale-[1.01] transition-all duration-300"
    >
      <img
      src={data?.image}
      alt="Link Preview"
      className="w-full h-36 object-cover"
      />
      <div className="p-3 flex-1 flex flex-col">
      <h3 className="truncate text-base font-semibold text-white mb-1 font-mona">
        {data?.title}
      </h3>
      <p className="text-sm text-ellipsis text-zinc-400 leading-relaxed line-clamp-3 font-dmSans">
        {data?.description}
      </p>
      </div>
    </a>
    </div>
  )
}

export default LinkPreviewer