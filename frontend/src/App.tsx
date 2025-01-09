import { Button } from "./components/ui/Button";
import { PlusIcon } from "./icons/plusIcon";
import { ShareIcon } from "./icons/shareIcon";


function App() {
  return (
    <>
      <div className="flex flex-row-reverse p-3">
        {/* <Button variant="primary" startIcon={<PlusIcon size="sm"/>} size="sm" title="hello"/> {" "} */}
        <Button variant="secondary" startIcon={<PlusIcon size="md"/>} size="md" title="New Content"/> {" "}
        <Button variant="primary" startIcon={<ShareIcon size="md" />} size="md" title="Share"/>
      </div>
    </>
  );
}

export default App;
