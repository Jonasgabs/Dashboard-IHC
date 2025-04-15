import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for the table rows
interface Lead {
  id: number; // Unique identifier for each Lead
  name: string; // Lead name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the Lead
  price: string; // Price of the Lead (as a string with currency symbol)
  // status: string; // Status of the Lead
  status: "Qualificado" | "Em atendimento"; // Status of the Lead
}

// Define the table data using the interface
const tableData: Lead[] = [
  {
    id: 1,
    name: "Afonso",
    variants: "07/04/2025, 21:58",
    category: "5 níveis de liderança",
    price: "Instagram",
    status: "Qualificado",
  },
  {
    id: 2,
    name: "Ana",
    variants: "07/04/2025, 21:58",
    category: "5 níveis de liderança",
    price: "Facebook",
    status: "Em atendimento",
  },
  {
    id: 3,
    name: "Carlos",
    variants: "07/04/2025, 21:58",
    category: "5 níveis de liderança",
    price: "Facebook",
    status: "Qualificado",
  },
  {
    id: 4,
    name: "Flavio",
    variants: "07/04/2025, 21:58",
    category: "5 níveis de liderança",
    price: "Instagram",
    status: "Qualificado",
  },
  {
    id: 5,
    name: "Jose",
    variants: "07/04/2025, 21:58",
    category: "5 níveis de liderança",
    price: "Instagram",
    status: "Qualificado",
  }]

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ultimos Leads
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nome 
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Origem
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Interesse
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Data / Hora
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((Lead) => (
              <TableRow key={Lead.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {Lead.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {Lead.variants}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {Lead.price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {Lead.category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      Lead.status === "Qualificado"
                        ? "success"
                        : Lead.status === "Em atendimento"
                        ? "warning"
                        : "error"
                    }
                  >
                    {Lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
