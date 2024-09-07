

export function StackedList({ ...props }) {
  return (
    <ul
      role="list"
      className="content divide-y divide-content overflow-hidden shadow-sm ring-1 sm:rounded-xl"
    >
      {props.children}
    </ul>
  );
}

export function StackedListItem({ ...props }) {
  return (
    <li
      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-content-hover sm:px-6"
    >
      {props.children}
    </li>
  );
}
