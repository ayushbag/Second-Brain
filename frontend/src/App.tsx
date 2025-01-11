import { Button } from "./components/Button";
import Card from "./components/Card";
import { PlusIcon } from "./icons/plusIcon";
import { ShareIcon } from "./icons/shareIcon";

function App() {
  return (
    <>
    <section className="p-2">
        <Button variant="primary" text="Add Content" startIcon={<PlusIcon />} size="md"/> {" "}
        <Button variant="secondary" startIcon={<ShareIcon />} text="Share Brain" size="md"/> {" "}
        <Card 
          link="https://www.youtube.com/watch/Bj2ly9PMdPI?si=akxFpnu3rq3UID2y"
          title="Kirat the Goat"
          type="youtube"
        />
        <Card 
          link="https://x.com/100xDevs/status/1870328056105357591"
          title="Internship krle!"
          type="twitter"
        />
    </section>
    </>
  );
}

export default App;
