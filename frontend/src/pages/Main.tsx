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
        <div className="max-w-5xl mx-auto py-12 font-mona flex flex-col gap-10">
          <div className="text-zinc-400 text-3xl font-semibold px-5">Your Memories</div>
          <Mansory>
            <img className="rounded-md" src="https://images.unsplash.com/photo-1744029829181-ad19c2ee248b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" alt="" />
            <img className="rounded-md" src="https://plus.unsplash.com/premium_photo-1747054588576-f6bd489758f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8" alt="" />
            <img className="rounded-md" src="https://images.unsplash.com/photo-1744042417269-4837ea044843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" alt="" />
            <img className="rounded-md" src="https://images.unsplash.com/photo-1744148070187-b3815f7a9dbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8" alt="" />
            <img className="rounded-md" src="https://plus.unsplash.com/premium_photo-1746731481770-08b2f71661d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8" alt="" />
            <img className="rounded-md" src="https://images.unsplash.com/photo-1744132813623-5ce3c521eef4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8" alt="" />
          </Mansory>
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
