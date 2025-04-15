import { ReactNode, HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

// Props for Table
interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

// Props for TableHeader
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Props for TableBody
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Props for TableRow
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

// Props for TableCell
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement>, ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isHeader?: boolean;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className, ...rest }) => {
  return <table className={`min-w-full ${className}`} {...rest}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...rest }) => {
  return <thead className={className} {...rest}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className, ...rest }) => {
  return <tbody className={className} {...rest}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, ...rest }) => {
  return <tr className={className} {...rest}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...rest
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className} {...rest}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
