  
interface ITagIdProps {
    tagId: string | number;
  }
  
  const TagId = ({ tagId }: ITagIdProps) => {
    return (
      <div className="flex items-center">
        <div className="relative p-6 border-4 border-blue-500 rounded-md bg-transparent shadow-md shadow-blue-500/30">
          <div className="relative flex items-center justify-center gap-2">
          <span className="text-4xl b-[0px]">🌴</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
              TAG #{tagId}
            </h1>
          </div>
        </div>
      </div>
    );
  };
  
  export default TagId;
  