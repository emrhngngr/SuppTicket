import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from "lucide-react"; // Assuming 'lucide-react' is the correct library
import React, { ReactNode, useEffect, useState } from "react";

// Define types for props
interface Column {
  accessor?: string;
  id?: string;
  header?: string | ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  cell?: (row: any) => ReactNode;
  getValue?: (row: any) => any;
  getSortValue?: (row: any) => any;
}

interface ExportOption {
  value: string;
  label: string;
  onClick: () => void;
}

interface Action {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

interface Filter {
  label: string;
  component: ReactNode;
}

interface GenericTableProps {
  data?: any[];
  columns?: Column[];
  onRowClick?: (row: any) => void;
  pagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  sortable?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  actions?: Action[];
  filters?: Filter[];
  customRowRender?: (props: {
    row: any;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onClick: () => void;
    columns: Column[];
    dense: boolean;
  }) => ReactNode;
  customCellRender?: (props: {
    row: any;
    column: Column;
    value: any;
    index: number;
    columnIndex: number;
    dense: boolean;
  }) => ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  exportOptions?: ExportOption[];
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  onSearchChange?: (searchTerm: string) => void;
  currentPage?: number;
  totalItems?: number;
  serverSide?: boolean;
  filterComponent?: ReactNode;
  renderTopToolbar?: () => ReactNode;
  renderBottomToolbar?: () => ReactNode;
}

const GenericTable: React.FC<GenericTableProps> = ({
  data = [],
  columns = [],
  onRowClick,
  pagination = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  searchable = true,
  sortable = true,
  emptyMessage = "Veri bulunamadı",
  loading = false,
  selectable = false,
  onSelectionChange,
  actions,
  filters,
  customRowRender,
  customCellRender,
  className,
  striped = true,
  hoverable = true,
  bordered = false,
  dense = false,
  stickyHeader = false,
  exportOptions,
  defaultSortColumn,
  defaultSortDirection = "asc",
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearchChange,
  currentPage: externalCurrentPage,
  totalItems: externalTotalItems,
  serverSide = false,
  filterComponent,
  renderTopToolbar,
  renderBottomToolbar,
}) => {
  // İç state yönetimi (server-side değilse)
  const [currentPage, setCurrentPage] = useState<number>(
    externalCurrentPage || 1
  );
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sortColumn, setSortColumn] = useState<string | undefined>(
    defaultSortColumn
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Toplam sayfa sayısı ve toplam öğe sayısı hesaplama
  const totalItems = serverSide ? externalTotalItems || 0 : filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Veri değiştiğinde, filtrelenmiş veriyi güncelle
  useEffect(() => {
    if (!serverSide) {
      let result = [...data];

      // Arama filtresi uygula
      if (searchTerm) {
        result = result.filter((item) => {
          return columns.some((column) => {
            const value = column.accessor
              ? item[column.accessor]
              : column.getValue?.(item);
            return value
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          });
        });
      }

      // Sıralama uygula
      if (sortColumn && sortable) {
        const column = columns.find(
          (col) => col.accessor === sortColumn || col.id === sortColumn
        );
        if (column) {
          const accessor = column.accessor || column.id;
          const getSortValue =
            column.getSortValue ||
            ((item: any) => (accessor ? item[accessor] : undefined));

          result.sort((a, b) => {
            const aValue = getSortValue(a);
            const bValue = getSortValue(b);

            if (aValue === bValue) return 0;

            const compareResult = aValue > bValue ? 1 : -1;
            return sortDirection === "asc" ? compareResult : -compareResult;
          });
        }
      }

      setFilteredData(result);

      // Sayfa değişimi sonrası seçili öğeleri temizle
      setSelectedRows([]);
    }
  }, [data, searchTerm, sortColumn, sortDirection, serverSide]);

  // Sayfadaki verileri alma
  const getCurrentPageData = (): any[] => {
    if (serverSide) {
      return data;
    }

    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  };

  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Sayfa boyutu değiştirme
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
    if (onPageSizeChange) onPageSizeChange(Number(newSize));
  };

  // Sıralama değiştirme
  const handleSort = (column: Column) => {
    if (!sortable || !column.sortable) return;

    const columnId = column.accessor || column.id;
    if (sortColumn === columnId) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      if (onSortChange) onSortChange(columnId!, newDirection);
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
      if (onSortChange) onSortChange(columnId!, "asc");
    }
  };

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    if (onSearchChange) onSearchChange(value);
  };

  // Satır seçme işlevi
  const handleSelectRow = (id: any) => {
    if (!selectable) return;

    setSelectedRows((prev) => {
      const isSelected = prev.includes(id);
      const newSelection = isSelected
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id];

      if (onSelectionChange) onSelectionChange(newSelection);
      return newSelection;
    });
  };

  // Tüm satırları seçme/seçimi kaldırma
  const handleSelectAllRows = () => {
    if (!selectable) return;

    const currentData = getCurrentPageData();
    const allRowIds = currentData.map((row) => row.id);

    const allSelected = allRowIds.every((id) => selectedRows.includes(id));

    const newSelection = allSelected
      ? selectedRows.filter((id) => !allRowIds.includes(id))
      : [...new Set([...selectedRows, ...allRowIds])];

    setSelectedRows(newSelection);
    if (onSelectionChange) onSelectionChange(newSelection);
  };

  // Sıralama simgesini oluşturma
  const renderSortIcon = (column: Column) => {
    const columnId = column.accessor || column.id;

    if (sortColumn !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Üst araç çubuğu render etme
  const renderDefaultTopToolbar = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
      {/* Sol taraf: Arama ve filtreler */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border border-input bg-background py-2 pl-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  if (onSearchChange) onSearchChange("");
                }}
                className="absolute right-2 top-2.5"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        )}

        {filters && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
          </button>
        )}
      </div>

      {/* Sağ taraf: Dışa aktarma ve diğer işlemler */}
      <div className="flex items-center gap-2">
        {exportOptions && (
          <div className="relative">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Dışa Aktar
            </button>
            <div className="absolute z-10 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 hidden">
              <div className="px-2 py-1.5 text-sm font-semibold">
                Format Seçin
              </div>
              <div className="h-px bg-muted"></div>
              {exportOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={option.onClick}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {actions &&
          actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );

  // Filtre bileşenini render etme
  const renderFilterSection = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-slate-50 p-4 rounded-md mb-4 border">
        {filterComponent || (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters &&
              filters.map((filter, index) => (
                <div key={index}>
                  <label className="text-sm font-medium mb-1 block">
                    {filter.label}
                  </label>
                  {filter.component}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Sayfalama bileşenini render etme
  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        {/* Sayfa başına öğe seçimi */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sayfa başına:</span>
          <div className="relative w-20">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-600 ml-4">
            Toplam: {totalItems} öğe
          </span>
        </div>

        {/* Sayfa numaraları ve gezinme */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center mx-2">
            <span className="text-sm font-medium">
              Sayfa {currentPage} / {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Ana tablo render etme fonksiyonu
  const renderTable = () => {
    const currentData = getCurrentPageData();

    // Tablo sınıflarını oluşturma
    const tableClasses = [
      "w-full caption-bottom text-sm",
      className,
      bordered ? "border border-collapse" : "",
      stickyHeader ? "overflow-auto" : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Satır sınıflarını oluşturma fonksiyonu
    const getRowClasses = (row: any, index: number) =>
      [
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        onRowClick ? "cursor-pointer" : "",
        hoverable ? "hover:bg-slate-50" : "",
        striped && index % 2 === 1 ? "bg-slate-50" : "",
        selectedRows.includes(row.id) ? "bg-blue-50" : "",
      ]
        .filter(Boolean)
        .join(" ");

    return (
      <div className="relative w-full overflow-auto">
        <table className={tableClasses}>
          <thead className={stickyHeader ? "sticky top-0 bg-white z-10" : ""}>
            <tr className={`border-b transition-colors ${dense ? "h-8" : ""}`}>
              {selectable && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                  <input
                    type="checkbox"
                    checked={
                      currentData.length > 0 &&
                      currentData.every((row) => selectedRows.includes(row.id))
                    }
                    onChange={handleSelectAllRows}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.accessor || column.id}
                  className={`
                    h-12 px-4 text-left align-middle font-medium text-muted-foreground
                    ${column.width ? `w-${column.width}` : ""}
                    ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    }
                    ${
                      column.sortable && sortable
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    ${dense ? "py-2" : ""}
                  `}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div
                    className={`flex items-center ${
                      column.align === "right"
                        ? "justify-end"
                        : column.align === "center"
                        ? "justify-center"
                        : ""
                    }`}
                  >
                    {column.header}
                    {column.sortable && sortable && renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center p-4"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIndex) => {
                // Özel satır render etme fonksiyonu varsa kullan
                if (customRowRender) {
                  return customRowRender({
                    row,
                    index: rowIndex,
                    isSelected: selectedRows.includes(row.id),
                    onSelect: () => handleSelectRow(row.id),
                    onClick: () => onRowClick && onRowClick(row),
                    columns,
                    dense,
                  });
                }

                return (
                  <tr
                    key={row.id || rowIndex}
                    className={getRowClasses(row, rowIndex)}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {selectable && (
                      <td className={`p-4 align-middle ${dense ? "py-2" : ""}`}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                    )}

                    {columns.map((column) => {
                      const cellKey = column.accessor || column.id;

                      // Hücre değerini alma
                      const getCellValue = () => {
                        if (column.cell) {
                          return column.cell(row);
                        }

                        if (column.accessor) {
                          return row[column.accessor];
                        }

                        if (column.getValue) {
                          return column.getValue(row);
                        }

                        return null;
                      };

                      // Özel hücre render etme fonksiyonu varsa kullan
                      if (customCellRender) {
                        return customCellRender({
                          row,
                          column,
                          value: getCellValue(),
                          index: rowIndex,
                          columnIndex: columns.indexOf(column),
                          dense,
                        });
                      }

                      return (
                        <td
                          key={cellKey}
                          className={`
                            p-4 align-middle
                            ${
                              column.align === "right"
                                ? "text-right"
                                : column.align === "center"
                                ? "text-center"
                                : "text-left"
                            }
                            ${dense ? "py-2" : ""}
                            ${column.className || ""}
                          `}
                        >
                          {getCellValue()}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Üst Araç Çubuğu */}
      {renderTopToolbar ? renderTopToolbar() : renderDefaultTopToolbar()}

      {/* Filtreler */}
      {renderFilterSection()}

      {/* Tablo */}
      {renderTable()}

      {/* Alt Araç Çubuğu ve Sayfalama */}
      {renderBottomToolbar ? renderBottomToolbar() : renderPagination()}
    </div>
  );
};

export default GenericTable;
