import { ShareIcon } from "../icons/shareIcon";

interface CardProps {
  link: string;
  title: string;
  type: "twitter" | "youtube"
}

const Card = ({ link, type, title }: CardProps) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 max-w-64 p-3">
      <div className="flex justify-between">
        <div className="flex items-center font-semibold text-gray-500">
          <div className="pr-2">
            <ShareIcon />
          </div>
          {title}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            <a href={link} target="_blank">
              <ShareIcon />
            </a>
          </div>
          <div className="text-gray-500">
            <ShareIcon />
          </div>
        </div>
      </div>
      <div className="pt-4">
        {/* // video embeded */}
        {type === "youtube" &&
        <iframe className="w-full rounded-md" src={link.replace("watch", "embed")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        }

        {/* // tweet embed */}
        {type === "twitter" &&
          <div className="rounded-md">
            <iframe height="100%" width="100%" src={`https://twitframe.com/show?url=${link.replace("x.com", "twitter.com")}`}></iframe>
          </div>
        }
      </div>
    </div>
  );
};

export default Card;
