import { HiOutlineDotsVertical, HiOutlineMenu } from 'react-icons/hi';

export function TaskSortableSkeleton() {
  return (
    <div className="p-4 rounded-md bg-white shadow-sm mb-2 animate-pulse">
      <div className="flex items-start">
        <div className="cursor-grab mr-3 flex items-center">
          <HiOutlineMenu className="w-5 h-5 text-gray-300" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
        <div className="p-1 rounded-full ml-3 flex items-center">
          <HiOutlineDotsVertical className="w-5 h-5 text-gray-300" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded mt-4 w-1/4" />
    </div>
  );
}
