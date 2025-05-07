import { Input } from "@/components/ui/input";

const SearchContent = () => {
  return (
    <div>
      {" "}
      <div className="flex h-10 mt-32 justify-center items-center text-white">
        <div className="w-64 text-black font-semibold justify-center flex flex-col items-center space-y-10">
          <div>Search in Topics</div>
          <Input type="text" placeholder="Search" className="h-10" />
        </div>
      </div>
      
    </div>
  );
};

export default SearchContent;
