"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string | number;
  actions?: (row: T) => React.ReactNode;
  actionsAlign?: "left" | "center" | "right";
  actionsWidth?: string;
  description?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  addLabel?: string;
  onAdd?: () => void;
  showAdd?: boolean;
}

function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return undefined;
}

function getValue<T>(row: T, key: string) {
  return (row as Record<string, unknown>)[key];
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  actions,
  actionsAlign = "center",
  actionsWidth,
  description,
  searchPlaceholder = "Buscar...",
  pageSize = 10,
  addLabel = "Adicionar",
  onAdd,
  showAdd = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    null
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const termo = search.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(getValue(row, col.key) ?? "").toLowerCase().includes(termo))
    );
  }, [data, columns, search]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;

    const copia = [...filtered];
    copia.sort((a, b) => {
      const valorA = getValue(a, sort.key);
      const valorB = getValue(b, sort.key);
      const comparacao = String(valorA ?? "").localeCompare(String(valorB ?? ""), "pt-BR", {
        numeric: true,
      });
      return sort.direction === "asc" ? comparacao : -comparacao;
    });
    return copia;
  }, [filtered, sort]);

  const totalPaginas = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginaAtual = Math.min(page, totalPaginas);
  const inicio = sorted.length === 0 ? 0 : (paginaAtual - 1) * pageSize + 1;
  const fim = Math.min(paginaAtual * pageSize, sorted.length);
  const linhas = sorted.slice(inicio - 1, fim);

  function alternarOrdenacao(key: string) {
    setSort((atual) => {
      if (atual?.key !== key) return { key, direction: "asc" };
      if (atual.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function handleSearch(valor: string) {
    setSearch(valor);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-3">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Buscar:</span>
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-64"
          />
        </div>

        {showAdd &&
          (onAdd ? (
            <Button className="gap-1.5" onClick={onAdd}>
              <Plus />
              {addLabel}
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={<Button className="gap-1.5 opacity-60" aria-label={addLabel} />}
                >
                  <Plus />
                  {addLabel}
                </TooltipTrigger>
                <TooltipContent>Em breve</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={cn(alignClass(col.align), col.width)}>
                  {col.sortable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => alternarOrdenacao(col.key)}
                      className={cn(
                        "gap-1 px-2 font-medium text-foreground",
                        col.align === "center" && "mx-auto",
                        col.align === "right" ? "ml-auto" : col.align !== "center" && "-ml-2"
                      )}
                    >
                      {col.header}
                      <ArrowUpDown
                        className={cn(
                          sort?.key === col.key ? "text-foreground" : "text-muted-foreground/50"
                        )}
                      />
                    </Button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
              {actions && (
                <TableHead className={cn(alignClass(actionsAlign), actionsWidth)}>
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              linhas.map((row, index) => (
                <TableRow key={getRowId(row)} className={cn(index % 2 === 1 && "bg-muted/40")}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(alignClass(col.align), col.width)}>
                      {col.render ? col.render(row) : String(getValue(row, col.key) ?? "")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className={cn(alignClass(actionsAlign), actionsWidth)}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          actionsAlign === "center" && "justify-center",
                          actionsAlign === "right" && "justify-end"
                        )}
                      >
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {inicio} a {fim} de {sorted.length} registros
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span>
            {paginaAtual} / {totalPaginas}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual >= totalPaginas}
            onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
