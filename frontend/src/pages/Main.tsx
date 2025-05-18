import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AddContentModal from "../components/AddContentModal";
import { getAuth } from "firebase/auth";
import AiInputBox from "../components/AiInputBox";
import background from "../assets/background.svg"
import LinePattern from "../assets/linepattern.svg"
import Mansory from "../components/Mansory";
import ShareModal from "../components/ShareModal";
import MansorySkeleton from "../components/MansorySkeleton";
import Button from "../components/Button";
import { Plus } from "lucide-react";

const getContent = async () => {
  let token: string | null = null;
  let email: string | null = null;

  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    token = await user.getIdToken(true); // Force refresh token
    email = user.email;
    localStorage.setItem("Authorization", token);
  } else {
    throw new Error("User not authenticated");
  }
  console.log(token, email);
  try {
    const response = await axios.get("http://localhost:3000/content", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    console.log(response.data)
    // Return both content and email
    return { ...response.data, email };
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
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["content"],
    queryFn: getContent
  });

  const filteredData = handleFilter(data, filterContents);

  const scrollToContent = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const username = data?.email && data.email.charAt(0).toUpperCase() + data.email.substring(1, data.email.indexOf("@")).trim(0,5);

  console.log("Data" + filteredData)

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
          <div
            onClick={() => scrollToContent()}
            className="absolute font-mona left-1/2 bottom-4 sm:bottom-2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto w-full px-2 cursor-pointer"
          >
            <span className="text-zinc-300 text-sm sm:text-base font-medium text-center">Scroll down for memories</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Navbar */}
          <Navbar addContentModal={() => setAddContentModal((prev) => !prev)} shareBrainModal={() => setToggleShareBrainModal((prev) => !prev)} />

          {/* Background Text */}
          <div className="absolute font-dmSans inset-0 z-0 flex items-center justify-center pointer-events-none -translate-y-20 sm:-translate-y-16">
            <h1 className="truncate parent leading-8 text-wrap text-4xl sm:text-6xl font-bold bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent text-center">
              <span className="block sm:inline">Hello, </span>
              <span className="block sm:inline">{username}</span>
            </h1>
          </div>

          {/* AI Input box */}
          <div className="z-10 flex flex-grow items-center justify-center">
            <AiInputBox />
          </div>
        </div>

        {/* Memories */}
        <div ref={sectionRef} className="max-w-3xl sm:max-w-4xl mx-auto py-12 font-mona flex flex-col gap-10 items-center sm:items-start">
          <div className="text-zinc-400 text-3xl font-semibold px-5">Your Memories</div>
          {isFetching ?
            <MansorySkeleton />
            :
            <div className="w-full">
              <Mansory>
                {filteredData && filteredData.map((content: any) => (
                  <Card key={content._id} contentId={content._id} link={content.link} type={content.type} />
                ))}
                {data.message == "Content not found!" &&
                    <div className="flex flex-col items-center">
                      <h1 className="px-8">No Memories Found!</h1>
                    </div>
                }
              </Mansory>
            </div>
          }
        </div>
      </div>
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-soft-light"
        style={{ backgroundImage: `url(${background})` }}
      />
    </>
  );
};

export default Main;
