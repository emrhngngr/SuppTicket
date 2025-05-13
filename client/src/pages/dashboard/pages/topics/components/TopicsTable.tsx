import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Topic {
  id: number;
  title: string;
  description: string;
  createDate: string;
  roles?: string[];
  active?: boolean | string;
}

interface TopicsTableProps {
  topics: Topic[];
  columns: { key: string; label: string }[];
}

export const TopicsTable = ({ topics, columns }: TopicsTableProps) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                There are no topics available.
              </TableCell>
            </TableRow>
          ) : (
            topics.map((topic) => (
              <TableRow key={topic.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {topic[col.key as keyof Topic]?.toString()}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};