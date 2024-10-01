import * as React from "react";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  useAsyncList,
} from "react-stately";
import { Table } from "./Table";

interface StarWarsChar {
  name: string;
  url: string;
}

function AsyncSortTable() {
  let list = useAsyncList<StarWarsChar>({
    async load({ signal }) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();
      return {
        items: json.results,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first, 10) || first) < (parseInt(second, 10) || second)
              ? -1
              : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <Table
      aria-label="Example table with client side sorting"
      selectionMode="multiple"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      style={{ width: "70vw", height: "200px" }}
      focusMode="cell"
    >
      <TableHeader>
        <Column key="name" allowsSorting allowsResizing>
          Name
        </Column>
        <Column key="height" allowsSorting allowsResizing>
          Height
        </Column>
        <Column key="mass" allowsSorting allowsResizing>
          Mass
        </Column>
        <Column key="birth_year" allowsSorting allowsResizing>
          Birth Year
        </Column>
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => (
          <Row key={item.name}>
            {(columnKey) => <Cell>{item[columnKey]}</Cell>}
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

export default function App() {
  return (
    <div className="flex flex-col items-center max-w-xl mx-auto">
      {/* prettier-ignore */}
      <p className="mt-8 mb-16 text-gray-600">This sandbox shows a <strong><code>Table</code></strong> with resizable columns, built with <a href="https://react-spectrum.adobe.com/react-aria/" rel="noreferrer" target="_blank" className="text-blue-700 underline">React Aria</a> and <a href="http://tailwindcss.com/" rel="noreferrer" target="_blank" className="text-blue-700 underline">Tailwind CSS</a>.</p>
      <AsyncSortTable />
    </div>
  );
}
