import LinkPreviewer from "../components/LinkPreviewer";

const Test = () => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center gap-4 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute w-72 h-72 bg-[#3D365C] rounded-full blur-3xl opacity-30 top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-[#C95792] rounded-full blur-3xl opacity-30 bottom-20 right-20"></div>
        <div className="absolute w-64 h-64 bg-[#F8B55F] rounded-full blur-3xl opacity-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Content */}
        <div className="relative z-10 flex gap-4">
          <LinkPreviewer url="https://github.com/calcom/cal.com" />
          <LinkPreviewer url="https://medium.com/life-at-apollo-division/compare-the-cost-of-aws-lambda-fargate-and-ec2-for-your-workloads-ad112c4740fb" />
          <LinkPreviewer url="https://www.geeksforgeeks.org/devops-tutorial/" />
        </div>
      </div>
    </>
  );
};

export default Test;
