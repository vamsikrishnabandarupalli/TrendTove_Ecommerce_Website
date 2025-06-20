import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/seperator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(filterOptions).map(([category, options]) => (
          <Fragment key={category}>
            <div>
              <h3 className="text-base font-bold">{category}</h3>
              <div className="grid gap-2 mt-2">
                {options.map(({ id, label }) => (
                  <Label key={id} className="flex font-medium items-center gap-2">
                    <Checkbox
                      checked={filters?.[category]?.includes(id) || false}
                      onCheckedChange={() => handleFilter(category, id)}
                    />
                    {label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
