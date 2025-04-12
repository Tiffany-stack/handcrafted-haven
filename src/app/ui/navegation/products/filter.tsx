interface FilterProps {
  filterValueSelected: (value: number) => void;
}

const Categories = [
  { name: "All", id: 0 },
  { name: "Hand Crafted Jewellery", id: 1000 },
  { name: "Ceramics", id: 2000 },
  { name: "Bags", id: 3000 },
  { name: "Lamps", id: 4000 },
  { name: "Decorations", id: 5000 }
];

const Prices = [
  { name: "All", id: 0 },
  { name: "Under $20", id: 100 },
  { name: "Under $50", id: 200 },
  { name: "Under $100", id: 300 },
  { name: "Over $100", id: 400 }
];

export function Filter(props: FilterProps) {
  function onFilterValueChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    props.filterValueSelected(Number(event.target.value));
  }

  return (
    <select className="bg-blue-500 text-white" name="categoryOptions" onChange={onFilterValueChanged}>
      {Categories.map((category) => (
        <option className="bg-blue-500 text-white" value={category.id} key={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export function FilterByPrice(props: FilterProps) {
  function onFilterValueChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    props.filterValueSelected(Number(event.target.value));
  }

  return (
    <select className="bg-blue-500 text-white" name="pricingOptions" onChange={onFilterValueChanged}>
      {Prices.map((price) => (
        <option className="bg-blue-500 text-white" value={price.id} key={price.id}>
          {price.name}
        </option>
      ))}
    </select>
  );
}
