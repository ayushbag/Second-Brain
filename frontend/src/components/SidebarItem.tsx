import { HashIcon, Link, NotepadText, TwitterIcon, YoutubeIcon } from "lucide-react"
import { ContentTypes } from "../pages/Main"

const SidebarItem = ({
  activated, setFilterContent
}: {
  activated: ContentTypes,
  setFilterContent: (data: any) => void
}) => {

  const SidebarItems = [
    {
      type: "all",
      title: "all",
      icon: <HashIcon />
    },
    {
      type: "twitter",
      title: "tweets",
      icon: <TwitterIcon size="20"/>
    },
    {
      type: "youtube",
      title: "youtube",
      icon: <YoutubeIcon size="22"/>
    },
    {
      type: "document",
      title: "documents",
      icon: <NotepadText size="19"/>
    },
    {
      type: "otherlink",
      title: "links",
      icon: <Link size="20"/>
    }
  ]

  return (
    <>
      {SidebarItems.map((item, key) => (
        <div key={key} onClick={() => setFilterContent(item.type)} className={`w-full gap-2 md:gap-4 p-3 flex items-center font-mona ${activated === item.type ? "bg-zinc-700": ""} md:hover:bg-zinc-700 md:rounded-lg`}>


        <div>
          {item.icon}
        </div>
        <h1 className="text-md md:text-md lg:text-lg capitalize">
          {item.title}
        </h1>
      </div>
      ))}
    </>
  )
}

export default SidebarItem