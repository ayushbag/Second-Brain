import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";

interface User {
  email: string;
}

interface Content {
  _id: string;
  link: string;
  type: "twitter" | "youtube" | "link";
  title: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const SharePage = () => {
  const { shareLink } = useParams<{ shareLink: string }>(); // Type the params for `shareLink`
  const [content, setContent] = useState<Content[]>([]); // Use `Content[]` type for state
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/brain/${shareLink}`);
        if (res.data) {
          setContent(res.data.content || []);
          setUserEmail(res.data.user?.email || "Unknown User");
        }
      } catch (err) {
        console.error("Failed to fetch content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareLink]);

  if (loading) return <div className="text-white p-4">Loading shared content...</div>;

  if (!content.length) return <div className="text-gray-400 p-4">No content found for this link.</div>;

  return (
    <div className="p-6 text-white font-mona">
      <h1 className="text-xl mb-2 font-semibold">Shared Content</h1>
      <p className="text-sm text-gray-400 mb-6">Shared by: {userEmail}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <Card
            key={item._id}
            link={item.link}
            type={item.type}
            tags={item.tags}
            contentId={item._id}
            date={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default SharePage;
