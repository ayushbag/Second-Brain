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

  return (
    <>
      <div className="z-50 main max-w-7xl mx-auto text-white ">
      <div className="flex z-50 flex-col relative min-h-screen">
        {/*Content Modal */}
        {
        addContentModal &&
        <AddContentModal toggleModal={() => setAddContentModal((prev) => !prev)} />
        }

        {/* Navbar */}
        <Navbar addContentModal={() => setAddContentModal((prev) => !prev)} />

        {/* Background Text */}
        <div className="absolute font-dmSans inset-0 z-0 flex items-center justify-center pointer-events-none -translate-y-14">
        <h1 className="parent text-4xl sm:text-6xl font-bold bg-gradient-to-b from-white via-white to-zinc-800 bg-clip-text text-transparent text-center">
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
      <div>
        <div>Start from here..</div>
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
