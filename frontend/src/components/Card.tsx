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
import { generateIframeMarkup, twitterTweet } from "../utils/embedConversions";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Card {
  text: string;
  tags: string[];
  type: "twitter" | "document" | "youtube" | "short_note" | "link";
  link?: string;
  shortNote?: string;
  contentId: any;
}

const Card = ({ text, tags, type, link, shortNote, contentId }: Card) => {
  // "https://x.com/mannupaaji/status/1833878491470713108"
  const twitterLink: string | undefined = link && twitterTweet(link);

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
      // await queryClient.invalidateQueries({ queryKey: ["content"], exact: true });
      // await queryClient.refetchQueries({ queryKey: ["content"], exact: true });
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

  return (
    <div className="main text-white font-mona bg-zinc-800 flex-wrap min-w-72 h-80 md:h-full rounded-md shadow-md p-4 border border-zinc-600">
      <div className="content flex flex-col gap-2">
        <div className="header flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div>
              {type === "short_note" && (
                <div className="note icon text-zinc-400">
                  <NotepadText size="22" />
                </div>
              )}
              {type === "twitter" && (
                <div className="twitter icon text-zinc-400">
                  <Twitter size="22" />
                </div>
              )}
              {type === "youtube" && (
                <div className="video icon text-zinc-400">
                  <TvMinimalPlay size="22" />
                </div>
              )}
              {type === "document" && (
                <div className="document icon text-zinc-400">
                  <Folder size="22" />
                </div>
              )}
              {type === "link" && (
                <div className="document icon text-zinc-400">
                  <Link size="22" />
                </div>
              )}
            </div>
            <h2 className="text-lg font-medium">
              {text.slice(0, 13)}
              {text.length > 13 ? <span>...</span> : null}
            </h2>
          </div>
          <div className="flex items-center gap-2 ml-4 text-zinc-400 pr-2">
            <div className="share">
              <Share2Icon size="18" />
            </div>
            <div
              onClick={() => handleDeleteMutation.mutate(contentId)}
              className="delete hover:cursor-pointer"
            >
              <Trash2 size="19" />
            </div>
          </div>
        </div>
        <div className="content ">
          {/* youtube */}
          {type === "youtube" && (
            <div className="yt-embed max-w-64 h-40 bg-zinc-900 rounded-md overflow-hidden">
              <iframe
                className="w-full h-full"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* twitter */}
          {type === "twitter" && (
            <div className="twitter-embed bg-zinc-50 rounded-md h-40 max-w-64 overflow-hidden">
              <blockquote className="twitter-tweet">
                <a href={twitterLink}></a>
              </blockquote>
            </div>
          )}

          {/* document */}
          {type === "document" && link && (
            <a href={link} target="_blank">
              <div className="default bg-zinc-900 rounded-md flex justify-center items-center text-zinc-400 overflow-hidden w-full h-40">
                <FolderOpen size="50" />
              </div>
            </a>
          )}

          {/* link */}
          {type === "link" && link && (
            <a href={link} target="_blank">
              <div className="default bg-zinc-900 rounded-md flex justify-center items-center text-zinc-400 overflow-hidden w-full h-40">
                <Link size="50" />
              </div>
            </a>
          )}

          {/* short note */}
          {type === "short_note" && shortNote && (
            <div className="text gap-2 pt-2 block h-40 w-full">
              <h2>{shortNote.slice(0, 160)}</h2>
            </div>
          )}
        </div>
        <div className="tags text-xs w-full flex flex-wrap gap-1 overflow-hidden pt-2 h-14">
          <div className="flex flex-wrap w-full h-fit gap-1">
            {tags.slice(0, 5).map((tag, key) => (
              <div
                key={key}
                className="tag bg-purple-700/60 p-0.5 px-2 rounded-lg border border-purple-700 text-purple-100"
              >
                {tag}
              </div>
            ))}
            {tags.length > 8 && (
              <div className="tag bg-purple-700/60 p-0.5 px-2 rounded-lg border border-purple-700 text-purple-100">
                ...
              </div>
            )}
          </div>
        </div>
        <div className="date flex items-center gap-1 text-zinc-400 pl-1 pt-2">
          <Calendar size="12" />
          <span className="text-sm">January 15, 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
