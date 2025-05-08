
import React from "react";
import { FileText,Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentCardProps {
  id: string;
  date: string;
  name: string;
  source: string;
  count: number;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  date,
  name,
  source,
  count,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <div className="flex justify-between items-start mb-2">
        <div className="bg-black text-white px-2 py-1 text-xs rounded">
          {id}
        </div>
        <div className="text-pink-500 text-xs">{date}</div>
      </div>
      <div className="mb-4">
        <h3 className="font-medium">{name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-600 text-sm">{source}</span>
          <span className="text-gray-600 text-sm">{count}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Checkbox id={`handover-${id}`} />
          <label
            htmlFor={`handover-${id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            To HandOver
          </label>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <Save className="h-4 w-4" />
          </button>
          <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700">
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
