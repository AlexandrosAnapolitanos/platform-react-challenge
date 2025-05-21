import { JSX } from "react";

type MasonryProps<ItemType, ExtraPropsType> = {
  items: ItemType[];
  renderItem: (item: ItemType, extraProps: ExtraPropsType) => JSX.Element;
  extraProps: ExtraPropsType;
};

export default function Masonry<ItemType, ExtraPropsType>({
  items,
  renderItem,
  extraProps,
}: MasonryProps<ItemType, ExtraPropsType>) {
  return (
    <div className="flex justify-center items-center">
      <ol className="columns-2 md:columns-5 gap-4 p-4">
        {items.map((item) => renderItem(item, extraProps))}
      </ol>
    </div>
  );
}
