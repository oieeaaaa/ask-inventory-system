import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import toStringifyDate from 'js/utils/toStringifyDate';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/suppliers';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import Input from 'components/input/input';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const Supplier = ({ data, helpers }) => {
  const parameterizer = ({ brand, entry, ...etc }) => ({
    ...etc,
    'brands.some.id': brand.id,
    entry_range: toStringifyDate(entry)
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="supplier"
        parameterizer={parameterizer}
        title="Supplier"
        icon="list"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="supplier-filters">
            <InputGroup
              name="entry"
              label="Entry"
              component={DateRangePicker}
            />
            <div className="supplier-filters__group">
              <InputGroup
                name="brand"
                label="Brand"
                component={Select}
                options={helpers.brands}
                mainKey="name"
              />
              <InputGroup
                name="terms"
                label="Terms"
                component={Input}
                type="number"
              />
            </div>
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const supplier = await fetcher('/supplier');
  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      data: safety(supplier, 'data', []),
      helpers: {
        brands: safety(brands, 'data', [])
      }
    }
  };
}

export default Supplier;
