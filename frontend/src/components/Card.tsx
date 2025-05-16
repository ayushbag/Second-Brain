import {
  Calendar,
  Folder,
  FolderOpen,
  Link,
  NotepadText,
  Share2Icon,
  Trash2,
  TvMinimalPlay,
  Twitter,
} from "lucide-react";
import { generateIframeMarkup, twitterTweetId } from "../utils/embedConversions";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LinkPreviewer from "./LinkPreviewer";
import { Tweet } from "react-tweet"

interface Card {
  text?: string;
  tags?: string[];
  type?: "twitter" | "youtube" | "link";
  link: string;
  shortNote?: string;
  contentId?: any;
  date?: any
}

const Card = ({ text, tags, type, link, shortNote, contentId, date }: Card) => {
  // "https://x.com/mannupaaji/status/1833878491470713108"
  const twitterLinkId: string | undefined = link && twitterTweetId(link);

  // "https://youtu.be/abiYRttaxpo?si=5wJ2aaXP5U5F4f4q"
  const youtubeEmbedUrl: string | undefined =
    (link && generateIframeMarkup(link)) || undefined;

  const queryClient = useQueryClient();

  const handleDelete = async (contentId: any) => {
    const token = localStorage.getItem("Authorization");
    try {
      const res = await axios.delete(
        `http://localhost:3000/content/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMutation = useMutation({
    mutationFn: () => handleDelete(contentId),
    onSuccess: () => {
      toast.success("Content added successfully!");
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.removeQueries({ queryKey: ["content"] });
    },
    onError: () => {
      toast.error("Failed to add content");
    },
  });

  console.log("Type is: " + type)

  return (
    <div className="group w-fit h-fit relative">
      {type === "twitter" ? 
        <div className="w-64 ">
          <Tweet 
            id={twitterLinkId}
          />
        </div>
      :
      <LinkPreviewer url={link} type={type}/>
      }
      <div className="relative">
        <div
          onClick={() => handleDeleteMutation.mutate(contentId)}
          className={`delete border border-0.5 border-zinc-600 bg-zinc-950/90 p-2 rounded-full hover:cursor-pointer absolute ${type === "twitter" ? 'bottom-9' : 'bottom-3'} right-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <Trash2 size="19" />
        </div>
      </div>
    </div>
  );
};

export default Card;
