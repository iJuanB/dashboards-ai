import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const data = [
  { id: 1, nombre: 'Producto A', stock: 5, devoluciones: 10 },
  { id: 2, nombre: 'Producto B', stock: 2, devoluciones: 5 },
  { id: 3, nombre: 'Producto C', stock: 8, devoluciones: 2 },
  { id: 4, nombre: 'Producto D', stock: 1, devoluciones: 15 },
  { id: 5, nombre: 'Producto E', stock: 3, devoluciones: 8 },
];

export function DynamicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Devoluciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.nombre}</TableCell>
            <TableCell>{item.stock}</TableCell>
            <TableCell>{item.devoluciones}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

