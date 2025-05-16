import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SidebarLarge from "../components/SidebarLarge";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ContentSkeleton from "../components/ContentSkeleton";
import AddContentModal from "../components/AddContentModal";
import { getAuth } from "firebase/auth";
import AiInputBox from "../components/AiInputBox";
import background from "../assets/background.svg"
import LinkPreviewer from "../components/LinkPreviewer";
import LinePattern from "../assets/linepattern.svg"
import Mansory from "../components/Mansory";
import ShareModal from "../components/ShareModal";


const getContent = async () => {
  let token: string | null = null;

  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    token = await user.getIdToken(true); // Force refresh token
    localStorage.setItem("Authorization", token);
  } else {
    throw new Error("User not authenticated");
  }
  console.log(token);
  try {
    const response = await axios.get("http://localhost:3000/content", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

const handleFilter = (data: any, type: ContentTypes) => {
  if (data === undefined) {
    return undefined;
  } else {
    if (type === "all") {
      return data.content;
    }

    console.log(data.content)
    return data.content.filter((item: any) => item.type === type);
  }
}

export type ContentTypes = "all" | "twitter" | "youtube" | "document" | "links";

const Main = () => {
  const [addContentModal, setAddContentModal] = useState<boolean>(false)
  const [toggleShareBrainModal, setToggleShareBrainModal] = useState<boolean>(false)

  const [filterContents, setFilterContents] = useState<ContentTypes>("all")

  const { data, isFetching } = useQuery({
    queryKey: ["content"],
    queryFn: getContent
  });

  const filteredData = handleFilter(data, filterContents);

  console.log(data)

  return (
    <>
      <div className="z-50 main max-w-7xl mx-auto text-white ">
        <div className="flex z-50 flex-col relative min-h-screen">
          {/*Content Modal */}
          {
            addContentModal &&
            <AddContentModal toggleModal={() => setAddContentModal((prev) => !prev)} />
          }

          {/* ShareBrainModal */}
          {
            toggleShareBrainModal &&
            <ShareModal toggleShareBrainModal={() => setToggleShareBrainModal((prev) => !prev)} />
          }

          {/* Scroll Down Text for Memories */}
          <div className="absolute font-mona left-1/2 bottom-4 sm:bottom-2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none w-full px-2">
            <span className="text-zinc-300 text-sm sm:text-base font-medium text-center">Scroll down for memories</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Navbar */}
          <Navbar addContentModal={() => setAddContentModal((prev) => !prev)} shareBrainModal={() => setToggleShareBrainModal((prev) => !prev)}/>

          {/* Background Text */}
          <div className="absolute font-dmSans inset-0 z-0 flex items-center justify-center pointer-events-none -translate-y-16">
            <h1 className="parent text-4xl sm:text-6xl font-bold bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent text-center">
              Hello, Pinaka
              {/* <span className="inline text-black">{'🚀'}</span> */}
            </h1>
          </div>

          {/* AI Input box */}
          <div className="z-10 flex flex-grow items-center justify-center">
            <AiInputBox />
          </div>
        </div>

        {/* Memories */}
        <div className="max-w-3xl sm:max-w-4xl mx-auto py-12 font-mona flex flex-col gap-10 items-center sm:items-start">
          <div className="text-zinc-400 text-3xl font-semibold px-5">Your Memories</div>
          <div className="w-full">
            <Mansory>
              {filteredData && filteredData.map((content: any) => (
                <Card key={content.id} link={content.link} type={content.type} />
              ))}
            </Mansory>
          </div>
        </div>
      </div>
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-soft-light"
        style={{ backgroundImage: `url(${LinePattern})` }}
      />
    </>
  );
};

export default Main;
