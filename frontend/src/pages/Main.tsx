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
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
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
      <div className="main max-w-7xl mx-auto text-white flex flex-col lg:flex-row relative bg-zinc-950 min-h-screen">
        {
          addContentModal && (
            <div className="z-50">
              <AddContentModal toggleModal={setAddContentModal} />
            </div>
          )
        }
        {
          toggleShareBrainModal && (
            <div className="z-50">
              <ShareModal toggleShareBrainModal={setToggleShareBrainModal} />
            </div>
          )
        }
        {toggleSidebar && (
          <div className="sidebar fixed top-0 lg:hidden z-10">
            <Sidebar toggleFunction={setToggleSidebar} />
          </div>
        )}
        <div className="lg:flex lg:w-full font-mona">
          <div className="hidden lg:block lg:w-1/4 h-screen bg-zinc-900/60 lg:sticky lg:top-0">
            <SidebarLarge activated={filterContents} setFilterContent={setFilterContents} />
          </div>
          <div className="lg:w-full lg:pt-3">
            <div className="sticky top-0 z-0">
              <Navbar toggleAddContentModal={setAddContentModal} toggleFunction={setToggleSidebar} toggleShareBrain={setToggleShareBrainModal}/>
            </div>
            <div className="px-6">
              <div>
                <h1 className="text-xl p-3 font-mona text-zinc-200 lg:hidden">
                  All Notes
                </h1>
              </div>
              <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 items-center justify-items-center">
                { isFetching ? 
                  <ContentSkeleton /> :
                  data ?
                  filteredData.map((item: any) => (
                    <div key={item._id}>
                      <Card
                        text={item.title}
                        tags={item.tags}
                        type={item.type}
                        link={item.link}
                        shortNote={item?.shortNote}
                        contentId={item._id}
                        date={item.createdAt}
                      />
                    </div>
                  )): 
                  <div className="w-full text-zinc-400">No Contents found</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
