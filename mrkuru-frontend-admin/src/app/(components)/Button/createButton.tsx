import { PlusCircleIcon } from "lucide-react";
import React from "react";

type CreateButtonProps = {
  name: string;
  onClickCreate?: () => void;
};

const CreateButton = ({ name, onClickCreate }: CreateButtonProps) => {
  return (
    <button
      className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-y-110 hover:scale-x-105"
      onClick={onClickCreate}
    >
      <PlusCircleIcon className="w-5 h-6 mr-2" />
      {name}
    </button>
  );
};

export default CreateButton;
